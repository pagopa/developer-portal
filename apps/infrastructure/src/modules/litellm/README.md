# LiteLLM on AWS (ECS Fargate)

Runs `docker.litellm.ai/berriai/litellm:main-stable` as one container per
Fargate task. The same process serves the admin UI, management API, and LLM API
on port **4000**. The public ALB forwards every path to this port; with TLS,
HTTP redirects to HTTPS. There are no separate UI/backend services, path-based
listener rules, bootstrap tasks, or migration tasks. Schema setup is handled
by the LiteLLM image at startup.

The module retains the existing `gateway` resource names and `gateway_*`
inputs for the single service, its sizing, workers, and autoscaling. One
service does not mean one replica: `gateway_desired_count` defaults to two
and autoscaling remains enabled. Each task contains exactly one container.

## Database and Redis

By default the module creates private Aurora PostgreSQL (one writer and one
reader) and an encrypted ElastiCache Redis replication group. Networking can
be created here or supplied with `vpc_id`, `public_subnet_ids`, and
`private_subnet_ids`. Private tasks need egress to the public image registry,
AWS services, and LLM providers. Managed stores need private subnets in two AZs.

For managed Aurora, the module reuses its existing generated master password
and creates a Secrets Manager value containing:

```text
postgresql://<username>:<password>@<aurora-writer-endpoint>:5432/litellm?sslmode=require
```

The URL uses `db_master_username` and `db_name`, not the old IAM-authenticated
`litellm_app` role. No IAM token or database-user bootstrap is required.
Because the image manages its schema itself, its database user needs schema
creation/migration privileges. For a separately managed application account,
provision its permissions outside this module and supply its URL secret.

The container receives `DATABASE_URL` through ECS Secrets Manager injection,
never as plaintext in the task definition, and `STORE_MODEL_IN_DB=true`.
The existing JSON credentials secret remains available for administration.
Terraform-created secret values are sensitive but still stored in Terraform
state; protect access to the state backend.

To use an existing URL secret instead:

```hcl
create_database         = false
database_url_secret_arn = "arn:aws:secretsmanager:eu-west-1:111122223333:secret:litellm-db-AbCdEf"
```

The secret must contain the entire PostgreSQL connection string. For a JSON
secret append `:DATABASE_URL::` to select that field. Terraform grants the ECS
execution role read access without reading or changing the secret value.
Secrets encrypted with a customer-managed KMS key also require `kms:Decrypt`
and a compatible key policy, managed by the caller. The host must resolve
from the ECS subnets: the Compose hostname `db` will not resolve to Aurora.
Use the real database endpoint and percent-encode reserved URL characters
in credentials. Alternatively, set sensitive `database_url` (preferably via
`TF_VAR_database_url`), and the module stores it in Secrets Manager.
The two URL inputs are mutually exclusive and require `create_database=false`.

With `create_database=false` and neither URL input set, no `DATABASE_URL` is
injected and `STORE_MODEL_IN_DB=false`; database-backed UI persistence, virtual
keys, and spend tracking are unavailable.

Managed Redis supplies `REDIS_HOST` from the primary endpoint, `REDIS_PORT=6379`,
and `REDIS_SSL=true`. For an existing cache, set `create_redis=false` and supply
sensitive `redis_url` (`rediss://` for TLS), which is injected as `REDIS_URL`.
Existing stores must allow connections from `task_security_group_id` or a
group supplied through `additional_task_security_group_ids`.

Enable Redis in the application configuration as well:

```hcl
proxy_config = {
  router_settings = {
    redis_host = "os.environ/REDIS_HOST"
    redis_port = "os.environ/REDIS_PORT"
  }
  litellm_settings = {
    cache = true
    cache_params = {
      type = "redis"
    }
  }
}
```

This example uses managed Redis; adapt connection settings for an existing
cache. Response caching is also enabled by this configuration. Without Redis,
each worker keeps its own rate-limit, budget, and routing state. The module
warns when the configured replica/worker ceiling exceeds one without Redis.

## Proxy configuration and environment

`proxy_config` is YAML-encoded into the private S3 bucket. When supplied, the
container downloads it at startup and invokes the image's production
entrypoint with `--config`, `--port 4000`, and `--num_workers`. Without a config,
the image's default entrypoint is retained. The config object's etag triggers
a task-definition revision and rolling deployment when the config changes.
Keep credentials out of this config; reference `os.environ/<NAME>` instead.

Use `gateway_extra_env` for non-sensitive settings and `gateway_extra_secrets`
for Secrets Manager references, including provider keys. `backend_extra_env`
and `backend_extra_secrets` remain compatibility inputs; they now apply to the
same container, with gateway values winning on collisions. Extra settings
override defaults, and a secret takes precedence over plaintext of the same
name. The task execution role receives read access to the referenced secrets.
`litellm_master_key`, `ui_password`, and the optional `litellm_license` remain
supported. OpenTelemetry and billing-metrics inputs also apply to this service.

## HTTPS and deployment

The reusable module accepts `acm_certificate_arn`. When creating a certificate
in the same apply, also set `enable_https=true` to avoid using an unknown ARN
to decide listener creation. Otherwise HTTPS is inferred from the supplied
ARN. HTTP-only operation requires `allow_plaintext_alb=true`.

`examples/default` creates and DNS-validates an ACM certificate in the ALB's
region for `litellm.<zone-name>` using `hosted_zone_id` (default
`Z02428843GXDP0RBGX2EQ`). It creates the validation record and the application
CNAME and waits for validation before attaching the certificate. The zone
must be public and delegated. An existing certificate or explicit HTTP-only
mode skips this automatic certificate/DNS setup.

```sh
cd apps/infrastructure/src/modules/litellm/examples/default
terraform init
terraform plan -out=out.tfplan
terraform apply out.tfplan
```

Use `litellm_url` for the certificate-covered hostname; the AWS ALB hostname
is not covered. Login defaults to the generated master key unless a UI
password is supplied. Secrets are injected when tasks launch; changes to an
external secret require a new deployment.

## Upgrading from the split deployment

Review a new plan before applying; do not reuse a saved plan from the old
topology. The plan should retain the ALB, gateway service/target group,
Aurora, Redis, master password, and networking. It replaces the gateway task
definition and removes backend/UI services, their scaling resources and
target groups, path rules, migration/bootstrap resources, and IAM DB-connect
permissions. Aurora switches to password authentication. No database
replacement is required by this topology change.

Traffic can be interrupted while the old routing rules are removed and the
new image starts and prepares its schema. Back up the database and confirm
the stable image is compatible with the deployed schema before applying;
image startup may change database contents. The image tag is intentionally
the requested mutable `main-stable`; override `gateway_image` with an
immutable version/digest for reproducible deployments.

Remove obsolete `backend_*` sizing/image/scaling inputs, `ui_*`
sizing/image/scaling inputs, `migrations_image`, `db_username`,
`gateway_connection_pool_enabled`, `gateway_pool_*`, `gateway_metrics_*`,
and `collector_*` inputs from callers. The metrics/collector sidecars and
their ports are no longer created. The `ui_password` input remains supported.
The `db_bootstrap_sql` and `migration_run_command` outputs have been removed;
`database_url_secret_arn` exposes the active database secret reference instead.

Aurora final snapshots and S3 retention remain enabled by default. Only set
`skip_final_snapshot` or `s3_force_destroy` for disposable environments.

## Local checks

From this module directory, run `terraform init -backend=false`,
`terraform validate`, and `terraform test`. Tests use mocked providers and
do not deploy resources or contact the live database.

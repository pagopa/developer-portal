# Local KB

Local replica of the chatbot vector index (KB) refresh flow, built on the code in
`apps/chatbot-index`:

```
S3 bucket (LocalStack) ──ObjectCreated/Removed──▶ index lambda (LocalStack) ──▶ Redis
                                                                                 ▲
indexer container: create index / full refreshes (same scripts as the actions) ─┘
```

| Service        | What it is                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| `lambda-deps` | Installs the lambda dependencies in `.lambda-deps/` (same base image of prod)    |
| `localstack`  | S3 bucket + index lambda (python3.12 zip, hot-reload) + bucket notifications     |
| `redis`       | Vector store (`redis-stack`, RedisInsight on http://localhost:8001)              |
| `indexer`     | Prod lambda image (with Chrome), used to run the scripts of the GitHub actions   |

The LocalStack setup (`localstack/init/ready.d/10-setup.sh`) mirrors
`apps/infrastructure/src/modules/chatbot/lambda_index.tf`: the lambda is triggered by
`.md` created/removed and by `main-guide-versions-dirNames-to-remove.json` created.

The lambda code is not packaged: LocalStack mounts `apps/chatbot-index` as
`/var/task` with hot-reload, and `.lambda-deps/` as `/opt/deps` (lambda layers are not
in the free plan). `lambda-deps` reinstalls the dependencies only when `pyproject.toml`
or `poetry.lock` change.

Models are mocked (`CHB_PROVIDER=mock` in `chatbot.env`): no Google credentials and
no costs. The search results are meaningless, but the whole flow is real.

## Requirements

- Docker with Compose v2
- AWS CLI on the host (only used against LocalStack)
- A LocalStack auth token (the free plan is enough)

```bash
cp .env.example .env   # then set LOCALSTACK_AUTH_TOKEN
```

## S3 data

The bucket is seeded with `s3-data/` (gitignored), a read-only copy of the `.md`
and `.json` files of the dev bucket:

```bash
B=s3://devportal-d-website-static-content
aws s3 sync $B/it/ s3-data/it/ --exclude "*" --include "*.md" --include "*.json" \
  --exclude "soap-api/*" --profile devportal-dev
aws s3 cp $B/sitemap.xml s3-data/sitemap.xml --profile devportal-dev
```

The seed is uploaded before the bucket notifications are configured, so it does
not trigger the lambda.

## Usage

All the commands are in `./kb.sh` (`./kb.sh help`).

```bash
./kb.sh up                          # install the lambda deps, start LocalStack + Redis
./kb.sh create --static --clean-redis
./kb.sh inspect
```

### Index creation and full refreshes

| Command                         | GitHub action                                               |
| ------------------------------- | ----------------------------------------------------------- |
| `./kb.sh create <flags>`        | `chatbot` (Chatbot Create Index)                             |
| `./kb.sh refresh api`           | `refresh-api-docs-vector-index`                              |
| `./kb.sh refresh dynamic`       | `refresh-dynamic-docs-vector-index`                          |
| `./kb.sh refresh static`        | `add-missing-static-docs-vector-index`                       |
| `./kb.sh refresh all`           | `refresh-all-docs-vector-index`                              |

`--dynamic` scrapes `CHB_WEBSITE_URL` with Selenium (about 5 seconds per page) and
`--api` downloads the OpenAPI specs: both need internet access and take time.

The first indexer run builds the prod lambda image. The indexer mounts
`apps/chatbot-index/src`, so code changes apply without a rebuild.

### Lambda triggered by S3 events

Open a terminal with `./kb.sh logs`, then:

```bash
KEY=it/devportal-docs/docs/app-io/modelli-servizi/v1.0/ambiente-e-animali/animali-domestici.md

./kb.sh put-doc $KEY                # update: the seeded file with a marker appended
./kb.sh inspect --list --filter animali-domestici
./kb.sh delete-doc $KEY             # removal
./kb.sh put-dirnames-to-remove      # align the static folders with the S3 lists
```

To test a main version change of a guide, upload a modified dirNames list (it does
not trigger the lambda) and then the file that does:

```bash
./kb.sh put-doc it/main-guide-versions-dirNames.json my-dirNames.json
./kb.sh put-dirnames-to-remove
```

### Lambda invoked directly

Synchronous invocation with the events in `events/`, it prints the end of the logs
and the result:

```bash
./kb.sh invoke events/object-created.json
./kb.sh invoke events/object-removed.json
./kb.sh invoke events/dirnames-to-remove.json
```

Thanks to hot-reload, changes to `apps/chatbot-index/src` apply to the next invocation.

## Reset

```bash
./kb.sh down     # keeps the Redis index
./kb.sh reset    # deletes the Redis index too
```

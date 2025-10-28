# Monitoring Module

TBD

## Push Docker Images to ECR

Before pushing Docker images, you need to login to your AWS ECR:

```bash
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
```

Note: Make sure to replace `${AWS_REGION}` and `${AWS_ACCOUNT_ID}` with your actual AWS region and account ID.

### [Clickhouse](https://hub.docker.com/r/clickhouse/clickhouse-server)

Clickhouse, use ECS Fargate, you can choose ARM64 image.

```bash
docker pull --platform linux/arm64 docker.io/clickhouse/clickhouse-server:25.8.8.26
docker tag docker.io/clickhouse/clickhouse-server:25.8.8.26 ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/clickhouse
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/clickhouse
```

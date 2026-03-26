# Structured Data Cleaner

Structured data cleaner service for directory removal.


## Setup

This project uses [Poetry](https://python-poetry.org/) for dependency management.

### Prerequisites

- Python 3.12 or 3.13
- Poetry (for dependency management)
- Docker and Docker Compose (for mock run)

### Installation

1. Navigate to the application directory:
   ```bash
   cd apps/structured-data-cleaner
   ```

2. Install dependencies:
   ```bash
   conda create -n structured-data-cleaner python=3.12 -y
   conda activate structured-data-cleaner
   poetry install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```bash
    # AWS Configuration
    AWS_DEFAULT_REGION=us-east-1
    # Comma-separated list of URLs to clean (e.g. "https://example.com,https://www.other.com")
    URLS="https://example.com,https://www.other.com"
    # Vector index name
    CHB_INDEX_ID="index_id"
    # Required S3 bucket name
    S3_BUCKET_NAME="s3_bucket_name"

    # Flags for app folder removal
    SHOULD_REMOVE_PARSER_FOLDER=true
    SHOULD_REMOVE_EXTRACTOR_FOLDER=true

    # Optional log level configuration (defaults to "info")
    LOG_LEVEL=info

    # Docker configuration (only needed in case of mock run on docker)
    AWS_ENDPOINT_URL=http://motoserver:5000
    MOTO_PORT=5000
    PYTHONPATH=/app
   ```

## Usage

### Running

Run from the `apps/structured-data-cleaner` folder. If not already in the virtual environment:
```bash
conda activate structured-data-cleaner
```
then:
```bash
set -a
source .env
set +a
PYTHONPATH=. poetry run python src/main.py
```

### Running the full pipeline with a mocked S3 bucket (Docker)

The Docker setup orchestrates the full pipeline — parser, extractor, and cleaner — against a
[Moto](https://docs.getmoto.org/) mock S3 server. No real AWS credentials are required.

#### Pipeline sequence

```
motoserver → s3-init → parser (×N URLs) → extractor (×N URLs) → structured-data-cleaner
```

| Service | Role |
|---|---|
| `motoserver` | Starts the Moto mock S3 server |
| `s3-init` | Creates the S3 bucket and copies sample files |
| `parser` | For each URL in `URLS`: crawls the URL and writes parsed JSON to `s3://<S3_BUCKET_NAME>/<CHB_INDEX_ID>/parser/<url>/` |
| `extractor` | For each URL in `URLS`: reads parser output and writes extracted JSON to `s3://<S3_BUCKET_NAME>/<CHB_INDEX_ID>/extractor/<url>/` |
| `main` | Removes the parser and extractor S3 folders for all `URLS` |

Each service waits for the previous one to exit successfully before starting.
Parser and extractor each run a pipeline script (`scripts/run.pipeline.sh`) that iterates over
the comma-separated `URLS`, processing one URL at a time.

#### Prerequisites

Configure `apps/structured-data-cleaner/.env` (see above). `URLS` drives the full pipeline —
every URL listed will be parsed, extracted, and then cleaned:

```bash
URLS="https://example.com,https://www.other.com"
CHB_INDEX_ID="index_id"
S3_BUCKET_NAME="your_s3_bucket_name"
```

The parser and extractor load their own `apps/parser/.env` and `apps/extractor/.env` for
service-specific settings (model config, depth, etc.). The compose file injects the shared
variables (`URLS`, `CHB_INDEX_ID`, `S3_BUCKET_NAME`, `AWS_ENDPOINT_URL`) on top, so those
take precedence.

For a fully offline run (no Google AI calls), set `EXTRACTOR_PROVIDER=mock` in
`apps/extractor/.env`.

#### Running

```bash
cd apps/structured-data-cleaner
docker compose --project-directory . -f docker/compose.yaml -f docker/compose.pipeline.yaml up
```

To rebuild images after code changes:

```bash
docker compose --project-directory . -f docker/compose.yaml -f docker/compose.pipeline.yaml up --build
```
### Running only one of the apps with a mocked S3 bucket (Docker)

Each service can be run independently using only the base compose file (no pipeline override).
`motoserver` and `s3-init` start automatically as dependencies.

#### structured-data-cleaner only

```bash
cd apps/structured-data-cleaner
docker compose --project-directory . -f docker/compose.yaml run structured-data-cleaner
```

#### parser only

```bash
cd apps/structured-data-cleaner
docker compose --project-directory . -f docker/compose.yaml run parser
```

Parser-specific settings (`DEPTH`, `VALID_DOMAIN_VARIANTS`, etc.) are read from `apps/parser/.env`.
The shared variables `URLS`, `CHB_INDEX_ID`, and `S3_BUCKET_NAME` are injected from
`apps/structured-data-cleaner/.env`.

#### extractor only

```bash
cd apps/structured-data-cleaner
docker compose --project-directory . -f docker/compose.yaml run extractor
```

Extractor-specific settings (LLM config, provider, etc.) are read from `apps/extractor/.env`.
The shared variables `URLS`, `CHB_INDEX_ID`, and `S3_BUCKET_NAME` are injected from
`apps/structured-data-cleaner/.env`.

> **Note:** Running the extractor alone requires parser output to already exist in the mock S3
> bucket. Either run the full pipeline first, run the parser step independently beforehand, or
> rely on the sample files pre-loaded by `s3-init` from `docker/files/s3/`.

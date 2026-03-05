# Structured Data Cleaner

Structured data cleaner service for directory removal.


## Setup

This project uses [Poetry](https://python-poetry.org/) for dependency management.

### Prerequisites

- Python 3.12 or 3.13
- Poetry (for dependency management)

### Installation

1. Navigate to the extractor directory:
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
    AWS_DEFAULT_REGION=eu-south-1
    # Comma-separated list of URLs to clean (e.g. "https://example.com,https://www.other.com")
    URLS="https://example.com,https://www.other.com"
    # Vector index name
    CHB_INDEX_ID="your_index_id"
    # Optional S3 bucket name (required if *should_run_locally* is ``False``)
    S3_BUCKET_NAME="your_s3_bucket_name"

    # Flags for app folder removal
    SHOULD_REMOVE_PARSER_FOLDER=true
    SHOULD_REMOVE_EXTRACTOR_FOLDER=true

    # Optional local run flag (defaults to false)
    SHOULD_RUN_LOCALLY=false

    # Optional log level configuration (defaults to "info")
    LOG_LEVEL=info
   ```

## Usage

### Running

If not already in the virtual environment,
```bash
   conda activate structured-data-cleaner
   ```
then
```bash
set -a
source .env
set +a
PYTHONPATH=. poetry run python src/main.py
```

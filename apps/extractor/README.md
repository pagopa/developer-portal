# Extractor

Extractor service for JSON files re-elaboration.

## Setup

This project uses [Poetry](https://python-poetry.org/) for dependency management.

### Prerequisites

- Python 3.12 or 3.13
- Poetry (for dependency management)
- Google AI API key

### Installation

1. Navigate to the extractor directory:
   ```bash
   cd apps/extractor
   ```

2. Install dependencies:
   ```bash
   conda create -n extractor python=3.12 -y
   conda activate extractor
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

   # Input and output folder:
   #
   # Derive the input folder automatically from the
   # same URL and index variables used by the parser. The extractor will read
   # from: s3://{S3_BUCKET_NAME}/{CHB_INDEX_ID}/parser/<sanitized(URL)>/  (S3)
   # and write to: s3://{S3_BUCKET_NAME}/{CHB_INDEX_ID}/extractor/<sanitized(URL)>/  (S3)
   URL=https://example.com          # same URL as passed to the parser
   CHB_INDEX_ID=my-index            # same index as passed to the parser
   S3_BUCKET_NAME=my-bucket         # required for S3 mode


   # LLM Configuration (optional, with defaults)
   EXTRACTOR_MODEL_ID=gemini-2.5-flash-lite
   EXTRACTOR_MODEL_TEMPERATURE=0.0
   EXTRACTOR_MODEL_MAXTOKENS=65535
   EXTRACTOR_PROVIDER=google # allowed: google, mock

   # Optional (either of the two needs to be specified if provider is not mock)
   CHB_AWS_GOOGLE_API_KEY=google_api_key
   CHB_AWS_SSM_GOOGLE_API_KEY=/local/google_api_key

   # Logging (optional, default: info)
   LOG_LEVEL=info
   ```

   **Note:** For local testing, set `CHB_AWS_GOOGLE_API_KEY` directly. In production, the app uses AWS SSM Parameter Store via `CHB_AWS_SSM_GOOGLE_API_KEY`.

## Usage

The files to process must be in the input folder. This folder is resolved in
the following way:

- **Derived from `URL` + `CHB_INDEX_ID`**,
   the path is computed with the same algorithm the parser uses for its output
   directory, so both apps stay in sync automatically: `s3://{S3_BUCKET_NAME}/{CHB_INDEX_ID}/parser/<sanitized(URL)>/`

### Running

If not already in the virtual environment,
```bash
   conda activate extractor
   ```
then
```bash
set -a
source .env
set +a
PYTHONPATH=. poetry run python src/main.py
```

### Input Format

Input JSON files should have the following structure:

```json
{
  "url": "https://example.com/page",
  "title": "Page Title",
  "bodyText": "Raw page content...",
  "lang": "it",
  "keywords": "keyword1, keyword2",
  "datePublished": null,
  "lastModified": "2026-02-10T12:41:22.000Z"
}
```

### Output Format

Output JSON files will have this structured format:

```json
{
  "title": "Page Title",
  "text": "# Cleaned Content\n\nFormatted as markdown...",
  "language": "it",
  "lastmod": "2026-02-10T12:41:22.000Z",
  "url": "https://example.com/page",
  "keywords": "keyword1, keyword2"
}
```

### Prompts (`config/prompts.yaml`)

The `content_cleaning_prompt` template instructs the LLM to:
- Remove navigation, footer, and boilerplate content
- Format output as clean markdown
- Preserve all main content without truncation
- Maintain the original language

### Running with a mocked S3 bucket (Docker)

The extractor can be run against a local [Moto](https://docs.getmoto.org/) mock S3 server as part
of the full pipeline, or in isolation. Both modes are orchestrated from the
`apps/structured-data-cleaner` package, which owns the Docker Compose setup.

See [`apps/structured-data-cleaner/README.md`](../structured-data-cleaner/README.md) for full
instructions on:
- Running the complete pipeline (`parser → extractor → structured-data-cleaner`)
- Running the extractor in isolation against mock S3

### Development

Install development dependencies:

```bash
poetry install --with dev
```

### Adding Custom Processing Logic

To customize the content processing:

1. Edit the prompt in [config/prompts.yaml](config/prompts.yaml)
2. Modify the `CleanedDocument` schema in [src/modules/schemas.py](src/modules/schemas.py) if output structure changes

### Testing

Run tests:

```bash
poetry run pytest
```
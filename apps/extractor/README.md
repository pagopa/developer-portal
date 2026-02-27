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
   poetry install
   ```

3. Create environment file:
   ```bash
   cp .env.default .env
   ```

4. Configure environment variables in `.env`:
   ```bash
   # AWS Configuration
   AWS_DEFAULT_REGION=eu-south-1
   
   # Required
   EXT_INPUT_FOLDER=input_folder
   EXT_OUTPUT_FOLDER=output_folder
   
   # Optional (with defaults)
   CHB_MODEL_ID=gemini-2.5-flash-lite
   CHB_MODEL_TEMPERATURE=0.0
   CHB_MODEL_MAXTOKENS=65535
   CHB_PROVIDER=google # allowed: google, mock

   # Optional (either of the two needs to be specified if provider is not mock)
   CHB_AWS_GOOGLE_API_KEY=google_api_key
   CHB_AWS_SSM_GOOGLE_API_KEY=/local/google_api_key
   ```

   **Note:** For local testing, set `CHB_AWS_GOOGLE_API_KEY` directly. In production, the app uses AWS SSM Parameter Store via `CHB_AWS_SSM_GOOGLE_API_KEY`.

## Usage

The files to process need to be in the directory specified in the environment variable EXT_INPUT_FOLDER.

### Running

```bash
poetry run python -m extractor
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
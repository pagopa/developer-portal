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
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```bash
   # Required
   EXT_AWS_GOOGLE_API_KEY=your_google_api_key_here
   EXT_INPUT_FOLDER=./input
   EXT_OUTPUT_FOLDER=./output
   
   # Optional (with defaults)
   EXT_MODEL_ID=gemini-2.5-flash-lite
   EXT_MODEL_TEMPERATURE=0.3
   EXT_MODEL_MAXTOKENS=4096
   LOG_LEVEL=info
   ```

## Usage

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
  "keywords": null,
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
  "url": "https://example.com/page"
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

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
   # Logging (optional, default: info)
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

### Development

Install development dependencies:

```bash
poetry install --with dev
```

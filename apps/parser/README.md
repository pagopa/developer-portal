
# Parser Utilities

This package provides a TypeScript CLI tool for recursively crawling a website, extracting structured metadata from each page, and saving the results in a predictable directory structure.

## Features

- **Recursive website parsing**: Visits all reachable pages up to a configurable depth.
- **Structured output**: Saves each page's metadata as a JSON file.
- **Configurable via environment variables or .env file**.

---

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Type-check & compile**
	```bash
	npm run compile
	```
3. **Build the project:**
	```bash
	npm run build
	```

---

## Usage

### 1. Configure Environment Variables

You can provide configuration in two ways:

#### a) Using a `.env` file (recommended)

Create a `.env` file in the `apps/parser` directory with the following content:

```
URL=https://example.com
CHB_INDEX_ID=name_of_your_choice
# DEPTH=2  # Optional, defaults to null
```

#### b) Using command line variables

```bash
URL=https://example.com DEPTH=2 CHB_INDEX_ID=name_of_your_choice npm run parse
```

### 2. Run the Parser

```bash
npm run parse
```

---

## Environment Variables

- **`URL`** (required): The root page to start parsing from.
- **`CHB_INDEX_ID`** (required): The base directory for storing parsed data. Output will be saved as `<CHB_INDEX_ID>/parsing/<sanitized(baseUrl)>/`.
- **`DEPTH`** (optional, default: `2`): Maximum recursion depth for crawling links.

**Note:** The parser will first look for these variables in the environment. If not found, it will load them from `.env` in the `apps/parser` directory.

---

## Output Structure

Each visited page is saved as a JSON file:

```
<CHB_INDEX_ID>/parsing/<sanitized(baseUrl)>/<sanitized(path)>.json
```

- `<sanitized(baseUrl)>` and `<sanitized(path)>` are filesystem-safe versions of the URL components (illegal characters replaced with `-`).
- This structure ensures output is predictable, easy to diff, and human-readable.

---

## Testing

Run tests with:

```bash
npm run test
```

Tests will compile the project and then execute Jest to ensure the CLI behaves as expected.

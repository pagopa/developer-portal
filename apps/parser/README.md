
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

To provide configuration, use a '.env' file (see .env.default for reference).

Create a `.env` file in the `apps/parser` directory with content like:

```
URL='https://example.com'
CHB_INDEX_ID='name_of_your_choice'
# DEPTH=2  # Optional, defaults to null
# VALID_DOMAIN_VARIANTS='["subdomain1", "subdomain2"]' # Optional, defaults to []
```

### 2. Run the Parser

```bash
npm run parse
```

---


## Environment Variables

Set the following environment variables to control the parser’s behavior:

- **`URL`** (required): The root page to start parsing from.
- **`CHB_INDEX_ID`** (required): The base directory for storing parsed data. Output will be saved as `<CHB_INDEX_ID>/parser/<sanitized(baseUrl)>/`.
- **`DEPTH`** (optional, default: null): Maximum recursion depth for crawling links. If set to null, the parsing won't have a maximum recursion depth and therefore will continue until all pages are parsed.
- **`VALID_DOMAIN_VARIANTS`** (optional, default: '[]'): Allow parsing specific domain variants (subdomains) of the base URL. Provide a JSON array of allowed subdomain tokens. For example, if `URL="https://example.com"`:
	- `VALID_DOMAIN_VARIANTS='["subdomain1", "subdomain2"]'` allows parsing `subdomain1.example.com` and `subdomain2.example.com`.
	- Domains like `subdomain3.example.com` will be skipped unless `subdomain3` is listed.
	- This variable controls which subdomains are included in the parsing scope, helping to avoid crawling unrelated or unwanted subdomains.

---

## Output Structure

Each visited page is saved as a JSON file:

```
<CHB_INDEX_ID>/parser/<sanitized(baseUrl)>/<sanitized(path)>.json
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

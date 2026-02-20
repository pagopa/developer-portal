
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

Create a `.env` file in the `apps/parser` directory with content like the `.env.default` file.


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
- **`PUBLIC_PARSER_REQUEST_TIMEOUT_MS`** (optional, default: 10000): This variable controls how long (in milliseconds) the parser will wait for a request to complete before timing out and terminating the operation.
- **`SHOULD_CREATE_FILES_LOCALLY`** (required, boolean): Whether to save parsed data in JSON format in a local directory. Set to `"true"` to enable local file storage.
- **`S3_BUCKET_NAME`** (required): The name of the AWS S3 bucket where parsed metadata will be stored.
- **`S3_ACCESS_KEY_ID`** (optional): AWS access key ID for S3 authentication. Required if S3 credentials are not provided by another method (e.g., IAM role).
- **`S3_SECRET_ACCESS_KEY`** (optional): AWS secret access key for S3 authentication. Required if S3 credentials are not provided by another method.
- **`NEXT_PUBLIC_COGNITO_REGION`** (optional): AWS region for S3 operations (e.g., `"us-east-1"`, `"eu-west-1"`). Used to configure the S3 client region.
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

## Parser utilities

This package contains the following TypeScript CLI utility:

- `parser` — recursively visits a website, extracts structured page metadata, and saves each page under `<VECTOR_INDEX_NAME>/parsing/<sanitized(baseUrl)>/`.


### Getting started

```bash
npm install
npm run build
```

### Parse a website

```bash
URL=https://example.com DEPTH=2 npm run parse
```

Environment variables:

- `URL` (required): root page for the parse.
- `DEPTH` (optional, default `2`): max depth for recursion.
- `VECTOR_INDEX_NAME` (optional): base directory name where parsed data will be stored as `<VECTOR_INDEX_NAME>/parsing/<sanitized(baseUrl)>/`.
- `OUTDIR` (optional): fully override the destination directory.
    - If neither `VECTOR_INDEX_NAME` nor `OUTDIR` is provided, the output directory defaults to `output/<sanitized(baseUrl)>/parsing/`.

`<sanitized(baseUrl)>` and `<sanitized(path)>` refer to filesystem-safe versions of the URL components (illegal characters replaced with `_`), ensuring predictable, human-readable filenames.

Each visited page is stored as `<VECTOR_INDEX_NAME>/parsing/<sanitized(baseUrl)>/<sanitized(path)>.json` (or under `OUTDIR` if specified) with normalized metadata, making it easy to diff between runs.


### Tests

```bash
npm test
```

Tests compile the project before executing Jest to ensure the CLI behaves exactly like the production build.

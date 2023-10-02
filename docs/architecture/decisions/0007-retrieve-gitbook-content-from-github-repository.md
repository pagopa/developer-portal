# 7. Retrieve GitBook content from GitHub repository

Date: 2023-06-05

## Status

Accepted

## Context

The system needs to read about 1300 pages of text from GitBook.

### Option 1

Use GitBook APIs to retrieve the contents. Render them with a custom parser.

### Option 2

Use the GitBook Sync feature to sync on [pagopa/devportal-docs](https://github.com/pagopa/devportal-docs/tree/docs/from-gitbook). Download them before building the site, parse them, and render them using [Markdoc](https://markdoc.dev/).

## Decision

Option 2, because the GitBook API has a rate limit, which makes the sync unfeasible.

## Consequences

Before the build, the system must download all the markdowns that come from GitBook.

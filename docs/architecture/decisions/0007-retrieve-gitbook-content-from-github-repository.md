# 7. Retrieve GitBook content from GitHub repository

Date: 2023-06-05

## Status

Accepted

## Context

The system need to read some contents (~1300 pages) from GitBook.

### Option 1

Use GitBook Apis. Render them with custom parser.

### Option 2

Use GitBook Sync feature to sync them on (pagopa/devportal-docs)[https://github.com/pagopa/devportal-docs/tree/docs/from-gitbook] GitHub repository. Download them before build the site, parse and render them using (Markdoc)[https://markdoc.dev/].

## Decision

Option 2, because the GitBook Api has a rate-limit which make the sync not feasible.

## Consequences

Before the build the system must download all the markdown that come from GitBook.

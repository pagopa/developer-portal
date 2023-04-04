# 4. Use GitBook client to interact with the API

Date: 2023-04-04

## Status

Proposed

## Context

We need to interact with GitBook API from our static website.

### Option 1
Use the [`@gitbook/api`](https://www.npmjs.com/package/@gitbook/api) package to interact with the API.

### Option 2
We can generate types and client using the [`swagger-typescript-api`](https://www.npmjs.com/package/swagger-typescript-api) library.

## Decision

We are going to change what we did in [ADR 3](0003-generate-gitbook-code-from-open-api.md), because GitBook releases new 
versions of their client and we no longer face the issue we had when we created the client.
So, we are going with [Option 1](#option-1), because it's the easiest way to interact with the API.

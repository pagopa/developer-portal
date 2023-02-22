# 3. Generate GitBook client code from OpenAPI

Date: 2023-02-22

## Status

Proposed

## Context

We need to interact with GitBook API from our static website.

### Option 1
Use the [`@gitbook/api`](https://www.npmjs.com/package/@gitbook/api) package to interact with the API.

### Option 2
We can generate types and client using the [`swagger-typescript-api`](https://www.npmjs.com/package/swagger-typescript-api) library.

## Decision

Even considering that Option 1 could be the easiest way to interact with the API, we decided to go with [Option 2](#option-2),
because at the moment GitBook's client is not stable and we have encountered some issues with it.  
Moreover, looking at the client's code, it looks like it's a wrapper around the generated code (they use the same library
as [Option 2](#option-2)).  
We could evaluate the use of the GitBook client in the future, but for now we are going to use the generated code.

[^1]: https://nextjs.org/docs
[^2]: https://nextjs.org/blog/next-13#new-app-directory-beta
[^3]: https://beta.nextjs.org/docs/rendering/server-and-client-components#server-components

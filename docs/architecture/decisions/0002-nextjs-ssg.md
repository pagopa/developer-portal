# 1. Next.JS SSG

Date: 2023-02-07

## Status

Proposal

## Context

We need to create a static website using [Next.JS](https://nextjs.org/).

### Option 1
Use the stable [^1] features of Next.JS.

### Option 2
Use the `app` directory beta [^2] features of Next.JS (this includes the new React ServerComponent [^3]).

## Decision

Even considering that Option 2 provides a more efficient way to create a static website, we are going for 
[Option 1](#option-1), because the beta features are not yet stable and, as NextJS says "APIs could change based on 
community feedback".  
We could evaluate the beta features again in the future.

[^1]: https://nextjs.org/docs
[^2]: https://nextjs.org/blog/next-13#new-app-directory-beta
[^3]: https://beta.nextjs.org/docs/rendering/server-and-client-components#server-components

# 6. Use NextJS App structure

Date: 2023-09-22

## Status

Accepted

## Context

At the moment, we are using version `13.4.19` of Next.JS with Pages Router.

### Option 1
Keep **Pages Router**.

### Option 2
Migrate to the **App Router**.

## Decision

We are going for [Option 2](#option-2), because the **App Router**:
1. is recommended since version `13.4` by the Next.js team [^1] 
2. it will be better maintained in the future
3. it guarantees better performances than Pages Router
4. it is more flexible with routes management

[^1]: https://nextjs.org/docs/migrating/from-pages

[^1]: https://nextjs.org/docs/app

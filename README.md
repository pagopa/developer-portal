# Developer Portal
[![CI](https://github.com/pagopa/developer-portal/actions/workflows/ci.yaml/badge.svg)](https://github.com/pagopa/developer-portal/actions/workflows/ci.yaml)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before you start, make sure you have complete the following steps:
- Create a `.env.local` file in the root of the project and add the environment variables shown in the `.env.default` file
- Get the GitBook API key from the [GitBook Developer Portal](https://developer.gitbook.com/api/authentication)
- Get the OrganizationId used on GitBook (you can find it in the URL when you are on the organization page; e.g.: `https://app.gitbook.com/o/myAmazingOrgId/`, the `myAmazingOrgId` is the OrganizationId)
- Install the dependencies: `yarn install`

Now that you are ready, run the development server:

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

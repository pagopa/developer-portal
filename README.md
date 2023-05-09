# Developer Portal
[![CI](https://github.com/pagopa/developer-portal/actions/workflows/ci.yaml/badge.svg)](https://github.com/pagopa/developer-portal/actions/workflows/ci.yaml)

In this repository you can find anything you need to work on the developer portal project.

## Requirements

- [Node.js](https://nodejs.org/docs/latest-v18.x/api/index.html)
- [yarnpkg](https://yarnpkg.com/)

## Local development

Before you start, make sure you have complete the following steps:
- Create a `.env.local` starting from `.env.default` and fill all the environment variables.
  - Get the GitBook API key from the [GitBook Developer Portal](https://developer.gitbook.com/api/authentication).
- Install the dependencies: `yarn install`.

### Run the developer portal locally

Run the following command from the root folder.

``` bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run the Storybook locally

To access the [Storybook](https://storybook.js.org/) and view the available React components, follow these instructions:

```bash
yarn workspace nextjs-website storybook:run
```

Open [http://localhost:6006](http://localhost:6006) to access to the storybook.

## Commands Cheat Sheet

### Workspace

For more information check [yarnpkg workspace documentation](https://classic.yarnpkg.com/en/docs/cli/workspace).

#### Run commands

Run the chosen Yarn command in each workspace.

``` bash
yarn workspaces run <command>
```

Run the chosen Yarn `command` on package `<package-name>`.

``` bash
yarn workspace <package-name> <command>
```

#### Manage dependencies

Add to the root the dependency `<dependency-name>`.

``` bash
yarn add <dependency-name>
```

Add to the package `<package-name>` the dependency `<dependency-name>` as `devDependencies`.

``` bash
yarn workspace <package-name> add <dependency-name> --dev
```



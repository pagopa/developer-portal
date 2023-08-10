# Developer Portal

In this repository you can find anything you need to work on the developer portal project.

## Requirements

- [Node.js](https://nodejs.org/docs/latest-v18.x/api/index.html)
- [npm CLI](https://docs.npmjs.com/cli/v9)

## Local development

Before you start, make sure you have complete the following steps:

``` bash
# install dependencies
npm i

# Download the static documentation that come from GitBook. It may take a while.
npm run download-docs -w nextjs-website
```

Finally in the `nextjs-website` app (`apps/nextjs-websites`), create a `.env.local` starting from `.env.default` and fill all the environment variables.

### Run the developer portal locally

Run the following command from the root folder.

``` bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

Open [http://localhost:6006](http://localhost:6006) with your browser to see the components playground.

### Run the Storybook locally

To access the [Storybook](https://storybook.js.org/) and view the available React components, follow these instructions:

```bash
npm -w storybook-playground run dev
```

Open [http://localhost:6006](http://localhost:6006) to access to the storybook.

## Commands Cheat Sheet


### Workspace

For more information check [npm CLI workspace documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces).

#### Run commands

Run the chosen command in each workspace.

``` bash
npm run <command> --workspaces
```

Run the chosen `command` on workspace `<workspace>`.

``` bash
npm -w <workspace> run <command>
```

#### Manage dependencies
Add to the root the dependency `<dependency>`.

``` bash
npm install <dependency>
```

Add to the package `<package>` the dependency `<dependency>` as `devDependencies`.

``` bash
npm -w <package> install <dependency> -D
```



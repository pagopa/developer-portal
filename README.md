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

Finally:
- in the `nextjs-website` app (`apps/nextjs-websites`), create a `.env.local` starting from `.env.default` and fill all the environment variables.
- in the `strapi-cms` app (`apps/strapi-cms`), create a `.env` starting from `.env.default` and fill all the environment variables.

### Run the developer portal locally

Run the following command from the root folder.

``` bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

Open [http://localhost:1337/admin/](http://localhost:1337/admin/) with your browser to see the CMS website.

### Run test locally

Run the following command from the root folder.

``` bash
npm run test
```

or run the following command to execute test of single workspace

``` bash
npm run test -w <workspace>
```

or run the following command to keep watching changes while updating code or test

``` bash
npm run test -w <workspace> -- --watch
```

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

## Changelog
This project utilizes [changesets](https://github.com/changesets/changesets) to generate the changelog. Here's how you can use it:

1. **Adding Changelog Information**: to add entries to the changelog, execute `npx changeset` or `npm run changeset`.  
This will initiate a wizard that guides you through the process.

2. **Defining the Change Type**: the wizard will ask you to specify the type of changes made (major, minor, patch).  
The summary you provide here will be added to the `CHANGELOG.md` file. Follow the [semver](https://semver.org/#summary) specification in order to choose the proper type of change.

3. **Generating the Changelog**: the [Changelog workflow](.github/workflows/changelog.yaml) uses the changeset's action to convert the changes tracked with `npm run changeset` into a `CHANGELOG.md` file.

4. **Creating a Pull Request**: after generating the changelog, the workflow will create a PR with the proposed changes, which include version bumping and updating the `CHANGELOG.md` file.

5. **Updating the PR**: if additional changes are made while the PR is open, the changeset's bot will automatically update the PR based on the changes in the `.changeset` folder.

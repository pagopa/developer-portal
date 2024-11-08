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
```

### Download the static documentation that come from GitBook. It may take a while.

You have 2 ways of accomplish it, the first one consists in downloading the whole docs as zip, using 
```bash
npm run download-docs -w nextjs-website
```

Or you can initialize a git submodule on .tmp-docs directory:  
```bash
git submodule add --force https://github.com/pagopa/devportal-docs.git apps/nextjs-website/.tmp-docs
``` 
and then run the script to checkout docs to the right branch
```bash
npm run update-docs -w nextjs-website
``` 

#### Update documentation
You can update the doc by downloading it again or, if you chose the submodule way, by running again the update command:
```bash
npm run update-docs -w nextjs-website
```

Finally:
- in the `nextjs-website` app (`apps/nextjs-websites`), create a `.env.local` starting from `.env.default` and fill all the environment variables.
- in the `strapi-cms` app (`apps/strapi-cms`), create a `.env` starting from `.env.default` and fill all the environment variables.

In order to get the Strapi API token needed in the .env.local:
- for local developement, you can find the token at: [http://localhost:1337/admin/settings/api-tokens] (http://localhost:1337/admin/settings/api-tokens)
- for the dev api token, ask one of the mantainer with admin access to [https://cms.dev.developer.pagopa.it] (https://cms.dev.developer.pagopa.it)

### Populate strapi cms

In order to start with a populated strapi database, run the following command:
``` bash
npx strapi transfer --from https://cms.developer.pagopa.it/admin --from-token <strapi_token>
```

The strapi token can be recovered by a mantainer with admin access to the production cms

Give that SQLite is used for local developement, this transfer will require the following lines to be added to `apps/strapi-cms/config/database.ts`:

```
      pool: {
        min: 2,
        max: 20,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 300000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis:1000,
        createRetryIntervalMillis: 2000
      },
      debug: false,
```

**Important**: remember to remove these lines after the transfer, before launching Strapi.

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

## Enable the chatbot for local developement

In the `nextjs-website` app (`apps/nextjs-websites`) add (or update if already present) the following lines: 

```
NEXT_PUBLIC_CHATBOT_HOST="https://api.chatbot.dev.developer.pagopa.it"
NEXT_PUBLIC_CHATBOT_ACTIVE="true"
```

##
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

## Storybook
To access the [Storybook](https://storybook.js.org/) and view the available React components, follow these instructions:
```bash
npm run storybook
```
and you will get a message like this:
```bash
╭────────────────────────────────────────────────────╮
│                                                    │
│   Storybook 7.6.17 for nextjs started              │
│   584 ms for manager and 17 s for preview          │
│                                                    │
│    Local:            http://localhost:6006/        │
│                                                    │
╰────────────────────────────────────────────────────╯
```
Open [http://localhost:6006](http://localhost:6006) with your browser to see the result.


## Changelog
This project utilizes [changesets](https://github.com/changesets/changesets) to generate the changelog. Here's how you can use it:

1. **Adding Changelog Information**: to add entries to the changelog, execute `npx changeset` or `npm run changeset`.  
This will initiate a wizard that guides you through the process.

2. **Defining the Change Type**: the wizard will ask you to specify the type of changes made (major, minor, patch).  
The summary you provide here will be added to the `CHANGELOG.md` file. Follow the [semver](https://semver.org/#summary) specification in order to choose the proper type of change.

3. **Generating the Changelog**: the [Changelog workflow](.github/workflows/changelog.yaml) uses the changeset's action to convert the changes tracked with `npm run changeset` into a `CHANGELOG.md` file.

4. **Creating a Pull Request**: after generating the changelog, the workflow will create a PR with the proposed changes, which include version bumping and updating the `CHANGELOG.md` file.

5. **Updating the PR**: if additional changes are made while the PR is open, the changeset's bot will automatically update the PR based on the changes in the `.changeset` folder.

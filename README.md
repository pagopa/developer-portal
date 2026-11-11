# Developer Portal

In this repository you can find anything you need to work on the developer portal project.

## Architecture Diagram
See [docs/architecture/chatbot-system.md](docs/architecture/chatbot-system.md) for a high-level diagram of chatbot components and connections.

## Requirements

- [Node.js](https://nodejs.org/docs/latest-v22.x/api/index.html)
- [npm CLI](https://docs.npmjs.com/cli/v10)

## Local development

Before you start, make sure you have complete the following steps:

``` bash
# install dependencies
npm i
```

Finally:

- in the `nextjs-website` app (`apps/nextjs-websites`), create a `.env.local` starting from `.env.default` and fill all the environment variables.
- in the `strapi-cms` app of the dedicated repositories folders (`apps/strapi-cms`), create a `.env` starting from `.env.default` and fill all the environment variables.

In order to get the Strapi API token needed in the .env.local:

- for local developement, you can find the token at: [http://localhost:1337/admin/settings/api-tokens] (http://localhost:1337/admin/settings/api-tokens)
- for the dev api token, ask one of the mantainer with admin access to [https://cms.dev.developer.pagopa.it] (https://cms.dev.developer.pagopa.it)

### Populate strapi cms

See the repository <https://github.com/pagopa/developer-portal-cms/>

### Compile the applications and the packages in the monorepo

Run the following command from the root folder.

``` bash
npm run compile
```

### Run the developer portal locally

Run the following commands from the root folder.

``` bash
npm run dev
```

You can run a single workspace by running:

``` bash
npm run dev -w <workspace>
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

### Enable the chatbot for local developement

In the `nextjs-website` app (`apps/nextjs-websites`) add (or update if already present) the following lines: 

```
NEXT_PUBLIC_CHATBOT_HOST="https://api.chatbot.dev.developer.pagopa.it"
NEXT_PUBLIC_CHATBOT_ACTIVE="true"
```

If wou want to lanuch the Chatbot backend locally, read `apps/chatbot/README.md`.

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

## SOAP API Sync

Launch the SOAP API sync manually from GitHub Actions.

Steps:

1. Open the repository’s Actions tab.
2. Select the workflow named Sync SOAP API Repo.
3. Click Run workflow and confirm.

No automatic schedule or trigger is configured due to the low frequency of SOAP API repository updates. Run it only when the upstream SOAP API repo has changed.

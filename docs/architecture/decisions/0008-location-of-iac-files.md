# 8. Location of the IaC files

Date: 2024-03-11

## Status

Accepted

## Context

We aim to version our Terraform code for infrastructure using [changeset](https://github.com/changesets/changesets). To achieve this, we need to create a node module containing the IaC. The critical decision lies in determining where to place this Terraform code.

### Option 1

Keep the code within the `<repository_root>/.infrastructure` folder.

**Cons**: hidden directories (those starting with a dot) in Linux file systems are typically reserved for configuration files and settings.

### Option 2

Move the code into `<repository_root>/infrastructure` folder

### Option 3

Move the code within the monorepo, under the `<repository_root>/apps/infrastructure` folder

## Decision
We choose Option 3 because, [as suggested by the Turbo documentation](https://turbo.build/repo/docs/handbook/workspaces#configuring-workspaces), the apps folder should contain launchable apps.  
The new infrastructure package involves a set of commands, making it a suitable fit for the description provided by Turbo.

## Consequences

Updating the references in our GitHub Workflows to execute code from the new directory will be necessary.

---
description: "Generate terraform readme files for all modules"
agent: "agent"
tools: ["read", "edit", "execute"]
---

# Generate terraform readme files

Generate or update terraform README.md files

## Instructions

1. Find all terraoform modules in apps/infrastructure/src
2. For each module use the command terraform-doc to create or update the existing README.md files.
3. Use the git commands to add and commit all terraform README.md file. Use an appropriate commit message lke update terraform docs.
4. Do not include in the git commit any file other than README.md files.
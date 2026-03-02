---
description: 'Search for an AWS CLI command based on a natural language description and provide the command with an explanation.'
agent: 'agent'
tools: 
 - web/fetch
 - aws-knowledge/aws___search_documentation

---

* Search for a AWS CLI command based on a natural language description.
* Provide the command with an explanation.
* Ask follow-up questions if the description is not clear or if there are multiple possible commands.

If there is a selection, run the command ${selection}
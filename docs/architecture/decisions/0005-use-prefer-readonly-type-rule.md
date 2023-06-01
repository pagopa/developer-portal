# 4. Use functional/prefer-readonly-type rule

Date: 2023-05-31

## Status

Accepted

## Context

We want the code to be immutable, so we are going to add some eslint rules to enforce that.

### Option 1
Use [functional/prefer-readonly-type rule](https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/prefer-readonly-type.md) even if it is deprecated.

### Option 2
Use both [functional/prefer-immutable-types](https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/prefer-immutable-types.md) and [functional/type-declaration-immutability](https://github.com/eslint-functional/eslint-plugin-functional/blob/main/docs/rules/type-declaration-immutability.md) that replace the deprecated rule.

## Decision

We are going with [Option 1](#option-1), because it's easier than option 2 and, at the moment, the rules of option 2 are not working properly.
We are going to evaluate option 2 again in the future (when the described rules are more mature).

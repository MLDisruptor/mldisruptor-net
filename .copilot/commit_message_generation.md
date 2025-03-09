# Commit Message Generation Instructions

## General Guidelines
- Follow the Conventional Commits specification (https://www.conventionalcommits.org/).
- Use the format: `<type>(<scope>): <subject>`.
- Ensure that the commit message is clear and concise.

## Types
- **feat**: A new feature for the user.
- **fix**: A bug fix for the user.
- **docs**: Documentation only changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
- **chore**: Other changes that don't modify src or test files.
- **revert**: Reverts a previous commit.

## Scope
- The scope could be anything specifying the place of the commit change.

## Subject
- The subject contains a succinct description of the change.
- Use the imperative mood in the subject line (e.g., "add" instead of "added" or "adds").
- Limit the subject line to 50 characters.

## Body
- The body should include the motivation for the change and contrast this with the previous behavior.
- Use the body to explain what and why (not how).
- Separate the subject from the body with a blank line.
- Limit the body line to 72 characters.

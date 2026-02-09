# Module 05: Basic CI with GitHub Actions

## Learning Objectives
- Understand CI/CD pipeline concepts
- Write GitHub Actions workflows
- Automate testing and building on push
- Use workflow triggers and job dependencies

## Prerequisites
- Completed Modules 01-04
- Read [CI/CD Introduction](../../docs/04-cicd-introduction.md)

## Assignment

Create a GitHub Actions CI workflow that:
1. Triggers on push to main and pull requests
2. Sets up Node.js 20
3. Installs dependencies
4. Runs tests
5. Builds the application

## Getting Started
```bash
cd assignments/module-05-basic-ci/starter
# Complete TODOs in ci.yml
# Copy to .github/workflows/ to activate
```

## Success Criteria
- [ ] Valid YAML syntax
- [ ] Triggers on push and PR
- [ ] Checks out code
- [ ] Sets up Node.js
- [ ] Installs dependencies with npm ci
- [ ] Runs tests
- [ ] Builds application

## Hints

<details>
<summary>Hint 1: Triggers</summary>
on: push: branches: [main] and pull_request: branches: [main]
</details>

<details>
<summary>Hint 2: Setup Node</summary>
uses: actions/setup-node@v4 with node-version: '20'
</details>

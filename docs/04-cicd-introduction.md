# CI/CD Introduction

## What is CI/CD?

- **CI (Continuous Integration)**: Automatically test and build code on every push
- **CD (Continuous Delivery)**: Automatically deploy tested code to production

## Benefits

- Catch bugs early with automated testing
- Consistent builds every time
- Faster feedback loops
- Reduced manual deployment errors
- Team confidence in code quality

## GitHub Actions Basics

GitHub Actions automates workflows triggered by repository events.

### Key Concepts

| Concept | Description |
|---------|-------------|
| Workflow | YAML file defining automation steps |
| Trigger | Event that starts a workflow (push, PR) |
| Job | Set of steps running on one machine |
| Step | Individual task (run command, use action) |
| Action | Reusable workflow component |

### Workflow File Location
```
.github/workflows/ci.yml
```

### Basic CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Docker Build Workflow

```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build backend
        run: docker build -t backend ./backend

      - name: Build frontend
        run: docker build -t frontend ./frontend
```

### Complete CI/CD Pipeline

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm ci && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp-backend ./backend
      - run: docker build -t myapp-frontend ./frontend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        run: echo "Deploy step here"
```

### Triggers

```yaml
# On push to main
on:
  push:
    branches: [main]

# On pull request
on:
  pull_request:
    branches: [main]

# On specific file changes
on:
  push:
    paths:
      - 'backend/**'
      - 'frontend/**'

# Manual trigger
on:
  workflow_dispatch:
```

## GitHub Classroom Integration

GitHub Classroom uses Actions for auto-grading student assignments:

1. Student pushes code
2. Workflow triggers automatically
3. Tests validate the submission
4. Results reported back to student and instructor

Configuration file: `.github/classroom/autograding.json`

## Next Steps

- [Troubleshooting](05-troubleshooting.md)
- [Best Practices](06-best-practices.md)

# Module 04: Multi-stage Builds

## Learning Objectives
- Optimize Docker images with multi-stage builds
- Reduce image size by separating build and runtime
- Implement security with non-root users
- Compare single-stage vs multi-stage image sizes

## Prerequisites
- Completed Modules 01-03
- Read [Dockerfile Guide](../../docs/02-dockerfile-guide.md)

## Assignment

Create optimized multi-stage Dockerfiles:
1. Backend: deps stage, development stage, production stage
2. Frontend: build stage, nginx production stage
3. Both must use non-root users in production
4. Production images must be smaller than 200MB

## Getting Started
```bash
cd assignments/module-04-multi-stage-builds/starter
# Complete TODOs in Dockerfile.backend and Dockerfile.frontend
docker build -f Dockerfile.backend -t backend-opt --target production ../../backend
docker build -f Dockerfile.frontend -t frontend-opt --target production ../../frontend
```

## Success Criteria
- [ ] Both Dockerfiles build without errors
- [ ] Production images run as non-root user
- [ ] Backend image < 200MB, Frontend image < 100MB
- [ ] Health checks configured
- [ ] All stages clearly commented

## Hints

<details>
<summary>Hint 1: Copying between stages</summary>
COPY --from=deps /app/node_modules ./node_modules
</details>

<details>
<summary>Hint 2: Non-root user</summary>
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
</details>

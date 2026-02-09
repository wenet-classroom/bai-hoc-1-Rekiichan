# Module 02: Dockerize the Frontend

## Learning Objectives
- Build multi-stage Docker images
- Serve React apps with Nginx
- Configure Nginx for SPA routing

## Prerequisites
- Completed Module 01
- Read [Dockerfile Guide](../../docs/02-dockerfile-guide.md)

## Assignment

Create a multi-stage Dockerfile for the frontend that:
1. Uses Node.js 20 Alpine to build the React app
2. Uses Nginx Alpine to serve the built files
3. Copies a custom nginx.conf
4. Exposes port 80

## Getting Started

```bash
cd assignments/module-02-dockerize-frontend/starter
# Complete TODOs in Dockerfile and nginx.conf
docker build -t frontend-app .
docker run -p 8080:80 frontend-app
# Visit http://localhost:8080
```

## Success Criteria
- [ ] Multi-stage Dockerfile builds without errors
- [ ] Frontend accessible at http://localhost:8080
- [ ] Nginx serves index.html for all routes (SPA)
- [ ] Image size < 100MB

## Testing
```bash
./tests/test.sh
```

## Hints

<details>
<summary>Hint 1: Build Stage</summary>
Use FROM node:20-alpine AS build, then COPY, npm ci, npm run build
</details>

<details>
<summary>Hint 2: Production Stage</summary>
Use FROM nginx:1.25-alpine, copy from build stage with --from=build
</details>

<details>
<summary>Hint 3: Nginx Config</summary>
Use try_files $uri $uri/ /index.html for SPA routing
</details>

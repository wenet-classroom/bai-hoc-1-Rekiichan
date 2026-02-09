# Module 01: Dockerize the Backend

## Learning Objectives

By completing this module, you will:
- Understand the structure of a Dockerfile
- Learn to containerize a Node.js application
- Configure environment variables in Docker
- Expose ports for network communication
- Build and run Docker images
- Validate container health

## Prerequisites

- Docker Desktop installed and running
- Basic knowledge of Node.js
- Understanding of terminal/command line

## Background

The backend is a Node.js Express API that connects to PostgreSQL. Your task is to create a Dockerfile that packages this application into a container image.

## Assignment Instructions

### Step 1: Examine the Backend Application

Navigate to the `backend/` directory and review:
- `package.json` - Dependencies and scripts
- `src/index.js` - Main application entry point
- `.env.example` - Environment variable template

### Step 2: Complete the Dockerfile

Open `starter/Dockerfile` and fill in the TODO sections:

1. Choose an appropriate Node.js base image
2. Set the working directory
3. Copy dependency files
4. Install dependencies
5. Copy application source code
6. Expose the application port
7. Define the startup command

<details>
<summary>Hint: Choosing a Base Image</summary>

Use an official Node.js image from Docker Hub. For production, prefer Alpine-based images (smaller size) like `node:20-alpine`. For learning, the standard `node:20` is fine.
</details>

<details>
<summary>Hint: Dependency Installation Order</summary>

Copy `package*.json` files BEFORE copying source code. This allows Docker to cache the dependency layer, speeding up rebuilds when only source code changes.
</details>

<details>
<summary>Hint: Port Configuration</summary>

The backend runs on port 3000 by default. Use the `EXPOSE` instruction to document this.
</details>

### Step 3: Build the Docker Image

```bash
cd assignments/module-01-dockerize-backend/starter
docker build -t backend:dev .
```

### Step 4: Run the Container

```bash
docker run -d -p 3000:3000 --name backend-test backend:dev
```

### Step 5: Test the Application

```bash
curl http://localhost:3000/health
```

Expected response: `{"status":"healthy"}`

### Step 6: Run the Validation Tests

```bash
cd assignments/module-01-dockerize-backend
chmod +x tests/test.sh
./tests/test.sh
```

## Success Criteria

- [ ] Dockerfile builds without errors
- [ ] Container starts successfully
- [ ] Health endpoint returns 200 status
- [ ] Image size is reasonable (under 500MB)
- [ ] All tests pass

## Common Mistakes

1. **Forgetting to copy package.json first**: This breaks dependency caching
2. **Using COPY . . too early**: Invalidates cache on every code change
3. **Not exposing ports**: Container won't be accessible
4. **Wrong CMD format**: Use JSON array format `["node", "src/index.js"]`
5. **Missing .dockerignore**: Can copy node_modules unnecessarily

## Troubleshooting

### Container exits immediately

Check logs: `docker logs backend-test`

Common causes:
- Missing dependencies
- Syntax errors in Dockerfile
- Application crashes on startup

### Cannot connect to port 3000

Verify:
- Container is running: `docker ps`
- Port mapping is correct: `-p 3000:3000`
- Application is listening on 0.0.0.0, not localhost

### Build is very slow

Check for:
- Missing .dockerignore (copying node_modules)
- Network issues downloading dependencies
- Large files being copied unnecessarily

## Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Docker Build Cache](https://docs.docker.com/build/cache/)

## Next Steps

Once you complete this module:
1. Compare your solution with `solution/Dockerfile`
2. Review the differences and understand why certain approaches are used
3. Proceed to [Module 02: Dockerize the Frontend](../module-02-dockerize-frontend/README.md)

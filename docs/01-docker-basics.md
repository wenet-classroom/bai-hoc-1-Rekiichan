# Docker Basics

## Table of Contents

1. [What is Docker](#what-is-docker)
2. [Why Use Docker](#why-use-docker)
3. [Containers vs Virtual Machines](#containers-vs-virtual-machines)
4. [Core Concepts](#core-concepts)
5. [Common Docker Commands](#common-docker-commands)
6. [Common Mistakes](#common-mistakes)
7. [Hands-on Exercise](#hands-on-exercise)

## What is Docker

Docker is a platform for developing, shipping, and running applications inside containers. A container packages your application code together with all its dependencies, libraries, and configuration files needed to run it.

Think of Docker as a shipping container for software. Just like physical shipping containers standardize how goods are transported, Docker containers standardize how software runs across different environments.

**Key Benefits:**

- **Consistency:** Works the same on your laptop, your colleague's machine, and production servers
- **Isolation:** Each container runs independently without interfering with others
- **Portability:** Run anywhere Docker is installed - Windows, Mac, Linux, cloud platforms
- **Efficiency:** Lightweight compared to virtual machines, shares the host OS kernel

## Why Use Docker

### Problem: "It Works on My Machine"

Without Docker, developers often face these issues:

```
Developer: "The app works fine on my machine!"
QA Team: "It crashes on the test server."
DevOps: "It won't start in production."
```

**Root causes:**
- Different operating system versions
- Missing dependencies or wrong versions
- Different environment variables
- Configuration file differences

### Solution: Docker Containers

With Docker, you package everything needed to run your app:

```
Developer: "Here's the Docker image."
QA Team: "Works perfectly in our environment."
DevOps: "Deployed to production without issues."
```

**How Docker solves it:**
- Package app + dependencies + runtime into one image
- Same image runs identically everywhere
- Version control for infrastructure
- Easy rollback if issues occur

## Containers vs Virtual Machines

### Comparison Table

| Aspect | Containers | Virtual Machines |
|--------|-----------|------------------|
| **Size** | Megabytes (typically 100-500 MB) | Gigabytes (typically 10-100 GB) |
| **Startup Time** | Seconds (1-3 seconds) | Minutes (2-5 minutes) |
| **Performance** | Near-native (minimal overhead) | Slower (hypervisor overhead) |
| **Isolation** | Process-level | Full OS-level |
| **OS** | Shares host kernel | Runs separate OS |
| **Resource Usage** | Lightweight, efficient | Resource-intensive |
| **Portability** | Highly portable | Less portable |
| **Use Case** | Microservices, dev environments | Running different OS, strong isolation |

### Visual Comparison

**Virtual Machines Architecture:**
```
┌─────────────────────────────────────────┐
│          Application Layer              │
├─────────────────────────────────────────┤
│  App A  │  App B  │  App C  │  App D    │
│  Bins   │  Bins   │  Bins   │  Bins     │
│  Libs   │  Libs   │  Libs   │  Libs     │
├─────────┼─────────┼─────────┼───────────┤
│ Guest OS│ Guest OS│ Guest OS│ Guest OS  │
├─────────────────────────────────────────┤
│           Hypervisor (VMware, VirtualBox)│
├─────────────────────────────────────────┤
│           Host Operating System         │
├─────────────────────────────────────────┤
│       Physical Server Hardware          │
└─────────────────────────────────────────┘
```

**Docker Containers Architecture:**
```
┌─────────────────────────────────────────┐
│          Application Layer              │
├─────────────────────────────────────────┤
│  App A  │  App B  │  App C  │  App D    │
│  Bins   │  Bins   │  Bins   │  Bins     │
│  Libs   │  Libs   │  Libs   │  Libs     │
├─────────────────────────────────────────┤
│           Docker Engine                 │
├─────────────────────────────────────────┤
│           Host Operating System         │
├─────────────────────────────────────────┤
│       Physical Server Hardware          │
└─────────────────────────────────────────┘
```

**Key Difference:** Containers share the host OS kernel, while VMs each run their own complete operating system.

## Core Concepts

### 1. Images

An **image** is a read-only template containing the application code, runtime, libraries, and dependencies. Think of it as a blueprint or a recipe.

**Characteristics:**
- Immutable (cannot be changed)
- Built in layers (each instruction in Dockerfile creates a layer)
- Stored in registries (Docker Hub, GitHub Container Registry)
- Tagged for versioning (e.g., `node:18-alpine`, `postgres:15.2`)

**Example:**
```bash
# Pull an official Node.js image from Docker Hub
docker pull node:18-alpine

# List images on your machine
docker images
```

**Output:**
```
REPOSITORY   TAG        IMAGE ID       CREATED        SIZE
node         18-alpine  abcd1234efgh   2 weeks ago    174MB
```

### 2. Containers

A **container** is a running instance of an image. It's the actual execution environment where your application runs.

**Characteristics:**
- Created from images
- Can be started, stopped, restarted, deleted
- Isolated filesystem, network, and processes
- Writable layer on top of read-only image layers
- Ephemeral (data lost when container removed unless using volumes)

**Relationship:**
```
Image (Blueprint)  →  Container (Running Instance)
postgres:15        →  my-database-container
node:18-alpine     →  my-backend-container
nginx:alpine       →  my-frontend-container
```

### 3. Layers

Docker images are built in **layers**. Each instruction in a Dockerfile creates a new layer.

**How Layers Work:**

```dockerfile
FROM node:18-alpine          # Layer 1: Base OS and Node.js
WORKDIR /app                 # Layer 2: Create working directory
COPY package*.json ./        # Layer 3: Copy dependency files
RUN npm install              # Layer 4: Install dependencies
COPY . .                     # Layer 5: Copy application code
CMD ["node", "server.js"]    # Layer 6: Define startup command
```

**Layer Visualization:**
```
┌─────────────────────────────┐
│  CMD ["node", "server.js"]  │ Layer 6 (top)
├─────────────────────────────┤
│  Application code           │ Layer 5
├─────────────────────────────┤
│  node_modules/              │ Layer 4
├─────────────────────────────┤
│  package.json, package-lock │ Layer 3
├─────────────────────────────┤
│  Working directory /app     │ Layer 2
├─────────────────────────────┤
│  node:18-alpine base        │ Layer 1 (bottom)
└─────────────────────────────┘
```

**Benefits of Layers:**
- **Caching:** Unchanged layers are reused, speeding up builds
- **Sharing:** Multiple images can share common base layers
- **Efficiency:** Only changed layers need to be transferred

### 4. Dockerfile

A **Dockerfile** is a text file containing instructions to build a Docker image.

**Simple Example:**
```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
```

### 5. Volumes

**Volumes** are persistent storage mechanisms that exist outside containers.

**Why Volumes:**
- Container filesystem is ephemeral (lost when container deleted)
- Volumes persist data beyond container lifecycle
- Share data between containers
- Better performance than bind mounts

**Types:**
```bash
# Named volume (managed by Docker)
docker run -v my-data:/app/data postgres:15

# Bind mount (maps host directory)
docker run -v /host/path:/container/path node:18

# Anonymous volume (Docker auto-generates name)
docker run -v /app/data postgres:15
```

### 6. Networks

Docker **networks** allow containers to communicate with each other.

**Default Network Types:**
- **bridge:** Default network, containers on same bridge can communicate
- **host:** Container uses host's network directly (no isolation)
- **none:** No network access

**Example:**
```bash
# Create custom network
docker network create my-app-network

# Run containers on same network
docker run --network my-app-network --name db postgres:15
docker run --network my-app-network --name api node:18
```

Containers `db` and `api` can now communicate using container names as hostnames.

## Common Docker Commands

### Image Management

```bash
# Pull image from registry
docker pull <image_name>:<tag>
docker pull nginx:alpine

# Build image from Dockerfile
docker build -t <image_name>:<tag> <path>
docker build -t my-app:1.0 .

# List images
docker images
docker image ls

# Remove image
docker rmi <image_id_or_name>
docker rmi my-app:1.0

# Remove unused images
docker image prune
docker image prune -a  # Remove all unused images
```

### Container Management

```bash
# Run container from image
docker run [options] <image_name>
docker run -d -p 8080:80 --name web nginx:alpine

# Common run options:
# -d                 Run in background (detached mode)
# -p 8080:80        Port mapping (host:container)
# --name web        Assign container name
# -e KEY=value      Set environment variable
# -v vol:/path      Mount volume
# --network net     Connect to network
# --rm              Remove container when stopped

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs <container_name>
docker logs -f <container_name>  # Follow logs (live stream)
docker logs --tail 100 <container_name>  # Last 100 lines

# Execute command in running container
docker exec -it <container_name> <command>
docker exec -it web bash           # Interactive bash shell
docker exec web ls /app            # Non-interactive command

# Stop container
docker stop <container_name>

# Start stopped container
docker start <container_name>

# Restart container
docker restart <container_name>

# Remove container
docker rm <container_name>
docker rm -f <container_name>  # Force remove running container

# Remove all stopped containers
docker container prune
```

### Information and Debugging

```bash
# Show container resource usage
docker stats

# Inspect container details (JSON)
docker inspect <container_name>

# Show container processes
docker top <container_name>

# Show port mappings
docker port <container_name>

# Show container filesystem changes
docker diff <container_name>
```

### System Management

```bash
# Show Docker disk usage
docker system df

# Clean up unused resources (containers, images, networks, volumes)
docker system prune
docker system prune -a  # Also remove unused images

# Show Docker version
docker version

# Show Docker system information
docker info
```

### Volume Management

```bash
# List volumes
docker volume ls

# Create volume
docker volume create my-volume

# Inspect volume
docker volume inspect my-volume

# Remove volume
docker volume rm my-volume

# Remove unused volumes
docker volume prune
```

### Network Management

```bash
# List networks
docker network ls

# Create network
docker network create my-network

# Inspect network
docker network inspect my-network

# Connect container to network
docker network connect my-network my-container

# Disconnect container from network
docker network disconnect my-network my-container

# Remove network
docker network rm my-network
```

## Common Mistakes

### 1. Using `latest` Tag in Production

**Problem:**
```dockerfile
FROM node:latest  # DON'T DO THIS
```

**Why it's bad:**
- `latest` tag can change without warning
- Breaks reproducibility
- Different team members might pull different versions
- Production issues from unexpected updates

**Solution:**
```dockerfile
FROM node:18.17.1-alpine  # Pin specific version
```

### 2. Running as Root User

**Problem:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]  # Runs as root (UID 0)
```

**Why it's bad:**
- Security risk if container compromised
- Containers shouldn't need root privileges
- Best practice: principle of least privilege

**Solution:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "server.js"]  # Now runs as nodejs user
```

### 3. Copying Files Before Installing Dependencies

**Problem:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .                    # Copies everything first
RUN npm install             # Cache invalidated on any file change
CMD ["node", "server.js"]
```

**Why it's bad:**
- Docker rebuilds all layers below changed layer
- Any code change invalidates npm install cache
- Slow builds (re-downloads packages every time)

**Solution:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./       # Copy dependency files first
RUN npm install             # This layer cached unless package.json changes
COPY . .                    # Copy code last
CMD ["node", "server.js"]
```

### 4. No `.dockerignore` File

**Problem:**
```
# Missing .dockerignore file
# COPY . . includes everything:
- node_modules/ (20,000 files)
- .git/ (entire Git history)
- build/ (old build artifacts)
- .env (secrets!)
```

**Why it's bad:**
- Slower builds (copying unnecessary files)
- Larger images
- Risk of leaking secrets
- Overwriting installed dependencies

**Solution:**

Create `.dockerignore` file:
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.DS_Store
coverage
dist
build
*.md
.vscode
.idea
```

### 5. Installing Development Dependencies

**Problem:**
```dockerfile
RUN npm install  # Installs devDependencies too
```

**Why it's bad:**
- Larger image size (testing frameworks, linters not needed)
- Longer build times
- Potential security vulnerabilities in dev packages

**Solution:**
```dockerfile
RUN npm install --production  # Production dependencies only
# OR use npm ci for deterministic builds
RUN npm ci --only=production
```

### 6. Not Using Multi-Stage Builds

**Problem:**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install  # Includes dev dependencies
COPY . .
RUN npm run build
CMD ["npm", "start"]
# Final image includes build tools, dev dependencies
```

**Solution:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### 7. Hardcoding Configuration

**Problem:**
```dockerfile
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

**Why it's bad:**
- Secrets in image layers
- Cannot change config without rebuilding
- Different environments need different configs

**Solution:**
```bash
# Pass at runtime
docker run -e DATABASE_URL=postgresql://... my-app
```

Or use `.env` file with docker-compose (see `03-docker-compose.md`).

## Hands-on Exercise

### Exercise: Run a Simple Web Server

**Objective:** Run an nginx web server serving a custom HTML page.

**Steps:**

1. **Create project directory:**
```bash
mkdir my-first-container
cd my-first-container
```

2. **Create an HTML file (`index.html`):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Docker Container</title>
</head>
<body>
    <h1>Hello from Docker!</h1>
    <p>This page is served from an nginx container.</p>
</body>
</html>
```

3. **Run nginx container with your HTML:**
```bash
docker run -d \
  --name my-web-server \
  -p 8080:80 \
  -v $(pwd)/index.html:/usr/share/nginx/html/index.html:ro \
  nginx:alpine
```

**Command breakdown:**
- `-d` - Run in background
- `--name my-web-server` - Name the container
- `-p 8080:80` - Map host port 8080 to container port 80
- `-v $(pwd)/index.html:/usr/share/nginx/html/index.html:ro` - Mount HTML file (read-only)
- `nginx:alpine` - Use lightweight nginx image

4. **Verify container is running:**
```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE          COMMAND                  PORTS                  NAMES
abc123def456   nginx:alpine   "/docker-entrypoint.…"   0.0.0.0:8080->80/tcp   my-web-server
```

5. **Test the web server:**

Open browser: `http://localhost:8080`

Or use curl:
```bash
curl http://localhost:8080
```

6. **View container logs:**
```bash
docker logs my-web-server
```

7. **Execute command inside container:**
```bash
docker exec -it my-web-server sh
ls /usr/share/nginx/html
exit
```

8. **Stop and remove container:**
```bash
docker stop my-web-server
docker rm my-web-server
```

### Challenge Exercise

**Task:** Create a simple Node.js API container.

**Requirements:**
1. Create `server.js` with simple Express server
2. Create `Dockerfile` to containerize the app
3. Build the image
4. Run container on port 3000
5. Test the API endpoint

**Solution Outline:**

`server.js`:
```javascript
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Docker container!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

`package.json`:
```json
{
  "name": "docker-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

`Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t my-api .
docker run -d -p 3000:3000 --name api-container my-api
curl http://localhost:3000/api/hello
```

## Next Steps

Now that you understand Docker basics:

1. Learn how to write optimized Dockerfiles - see `02-dockerfile-guide.md`
2. Explore multi-container applications - see `03-docker-compose.md`
3. Set up CI/CD pipelines - see `04-cicd-introduction.md`

## Summary

**Key Takeaways:**
- Docker containers package apps with all dependencies for consistency
- Containers are lightweight compared to VMs, sharing host OS kernel
- Images are blueprints, containers are running instances
- Layers enable caching and efficient builds
- Always pin image versions, run as non-root, use `.dockerignore`
- Volumes persist data, networks enable container communication

**Essential Commands:**
```bash
docker pull <image>         # Download image
docker build -t <name> .    # Build image
docker run [opts] <image>   # Create and start container
docker ps                   # List running containers
docker logs <container>     # View logs
docker exec -it <cnt> bash  # Access container shell
docker stop <container>     # Stop container
docker rm <container>       # Remove container
```

Continue to the next guide to learn Dockerfile best practices.

# Phase 05: Learning Materials & Documentation

**Context Links**: [Plan Overview](plan.md) | [Phase 04](phase-04-docker-setup.md)

## Overview

**Date**: 2026-02-09
**Description**: Create comprehensive learning materials, tutorials, and documentation
**Priority**: P1 (Critical - Student success depends on clear materials)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 3h

## Key Insights

From research:
- **Why-first teaching**: Explain benefits before commands
- **Progressive complexity**: Simple → practical → production
- **Common mistakes**: Address proactively with examples
- **Hands-on focus**: Theory supports practice, not vice versa

## Requirements

### Functional Requirements
- Main README with project overview and setup
- Docker basics tutorial (containers, images, layers)
- Docker Compose tutorial (multi-service orchestration)
- CI/CD introduction guide
- Troubleshooting guide with common errors
- Best practices document
- Quick reference cards

### Non-Functional Requirements
- Clear, beginner-friendly language
- Visual diagrams where helpful
- Code examples for every concept
- Step-by-step instructions
- Searchable structure (good headings)

## Architecture

### Documentation Structure
```
docs/
├── 00-getting-started.md         # Prerequisites, setup
├── 01-docker-basics.md            # Containers 101
├── 02-dockerfile-guide.md         # Writing Dockerfiles
├── 03-docker-compose.md           # Multi-service apps
├── 04-cicd-introduction.md        # GitHub Actions basics
├── 05-troubleshooting.md          # Common issues
├── 06-best-practices.md           # Production patterns
└── 07-glossary.md                 # Terms reference
```

## Related Code Files

### Files to Create
- `README.md` - Main project documentation
- `docs/00-getting-started.md` - Setup guide
- `docs/01-docker-basics.md` - Docker fundamentals
- `docs/02-dockerfile-guide.md` - Dockerfile tutorial
- `docs/03-docker-compose.md` - Compose tutorial
- `docs/04-cicd-introduction.md` - CI/CD concepts
- `docs/05-troubleshooting.md` - Problem solving
- `docs/06-best-practices.md` - Production tips
- `docs/07-glossary.md` - Terminology

### Files to Modify
None (new documentation)

## Implementation Steps

### Step 1: Main README.md
```markdown
# 🎓 DevOps Classroom - Docker & CI/CD Learning Resource

A complete full-stack application designed to teach Docker and CI/CD concepts through hands-on practice.

## 🎯 Learning Objectives

By completing this course, you will:
- ✅ Understand containerization concepts and benefits
- ✅ Write production-ready Dockerfiles
- ✅ Orchestrate multi-service applications with Docker Compose
- ✅ Build CI/CD pipelines with GitHub Actions
- ✅ Deploy containerized applications to VMs
- ✅ Follow DevOps best practices

## 📚 Course Structure

### Module 1: Dockerize the Backend
Learn to containerize a Node.js API with PostgreSQL

### Module 2: Dockerize the Frontend
Build production-ready React containers with Nginx

### Module 3: Docker Compose
Orchestrate multi-service applications

### Module 4: Multi-stage Builds
Optimize image sizes and build performance

### Module 5: Basic CI with GitHub Actions
Automate testing and builds

### Module 6: Complete CI/CD Pipeline
Build, test, and deploy automatically

### Module 7: VM Deployment
Deploy to production with docker-compose

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 24+ installed
- Node.js 20+ (for local development)
- Git
- Code editor (VS Code recommended)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repo-url>
cd classroom-mvp
```

2. **Start with Docker Compose**
```bash
docker-compose up
```

3. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### Alternative: Local Development

**Backend**:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📖 Documentation

- [Getting Started](docs/00-getting-started.md)
- [Docker Basics](docs/01-docker-basics.md)
- [Dockerfile Guide](docs/02-dockerfile-guide.md)
- [Docker Compose](docs/03-docker-compose.md)
- [CI/CD Introduction](docs/04-cicd-introduction.md)
- [Troubleshooting](docs/05-troubleshooting.md)
- [Best Practices](docs/06-best-practices.md)

## 🏗️ Project Structure

```
classroom-mvp/
├── backend/          # Node.js REST API
├── frontend/         # React UI
├── docs/             # Learning materials
├── assignments/      # Student exercises
├── .github/          # CI/CD workflows
└── docker-compose.yml
```

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# All tests in Docker
docker-compose run backend npm test
docker-compose run frontend npm test
```

## 📝 Assignments

Each module includes:
- Clear learning objectives
- Starter code with TODOs
- Auto-grading tests
- Solution reference

Start with [Module 1](assignments/module-01-dockerize-backend/README.md)

## 🆘 Getting Help

- Check [Troubleshooting Guide](docs/05-troubleshooting.md)
- Review [Common Mistakes](docs/01-docker-basics.md#common-mistakes)
- Ask instructor or classmates

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Hub](https://hub.docker.com)
- [GitHub Actions Docs](https://docs.github.com/actions)

## 📄 License

MIT License - Free for educational use
```

### Step 2: Docker Basics (docs/01-docker-basics.md)
```markdown
# Docker Basics

## What is Docker?

Docker is a platform for developing, shipping, and running applications in **containers**.

### Why Use Docker?

1. **Consistency**: "Works on my machine" → Works everywhere
2. **Isolation**: Apps run independently without conflicts
3. **Portability**: Same container runs on laptop, server, cloud
4. **Efficiency**: Lightweight compared to virtual machines

### Containers vs Virtual Machines

| Feature | Containers | VMs |
|---------|-----------|-----|
| Size | ~50MB | ~5GB |
| Startup | < 1 second | Minutes |
| Resource use | Shared OS kernel | Full OS copy |
| Isolation | Process-level | Hardware-level |

## Core Concepts

### Images
A **blueprint** for containers. Read-only template with app code, dependencies, and configuration.

```bash
# List images
docker images

# Pull an image
docker pull node:20-alpine
```

### Containers
A **running instance** of an image. Can be started, stopped, deleted.

```bash
# Run a container
docker run -p 3000:3000 my-app

# List running containers
docker ps

# Stop a container
docker stop <container-id>
```

### Layers
Images are built in **layers**. Each Dockerfile instruction creates a layer.

```dockerfile
FROM node:20-alpine    # Layer 1: Base image
COPY package.json .    # Layer 2: Package file
RUN npm install        # Layer 3: Dependencies
COPY . .               # Layer 4: Source code
```

**Why layers matter**: Docker caches unchanged layers → faster rebuilds!

## Common Commands

### Building Images
```bash
# Build image from Dockerfile
docker build -t my-app .

# Build with custom file
docker build -f Dockerfile.prod -t my-app:prod .
```

### Running Containers
```bash
# Run in foreground
docker run my-app

# Run in background (detached)
docker run -d my-app

# Run with port mapping
docker run -p 8080:3000 my-app

# Run with environment variables
docker run -e NODE_ENV=production my-app

# Run with volume mount
docker run -v $(pwd):/app my-app
```

### Managing Containers
```bash
# List all containers (including stopped)
docker ps -a

# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>

# Execute command in running container
docker exec -it <container-id> sh

# Remove container
docker rm <container-id>

# Remove all stopped containers
docker container prune
```

### Managing Images
```bash
# Remove image
docker rmi <image-id>

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

## Common Mistakes

### ❌ Using `latest` tag
```dockerfile
FROM node:latest  # Unpredictable!
```
✅ **Fix**: Pin versions
```dockerfile
FROM node:20-alpine  # Stable
```

### ❌ Running as root
Security risk!

✅ **Fix**: Create and use non-root user
```dockerfile
RUN adduser -S appuser
USER appuser
```

### ❌ Copying everything first
```dockerfile
COPY . .
RUN npm install  # Rebuilds deps on ANY file change
```

✅ **Fix**: Copy dependencies first
```dockerfile
COPY package*.json ./
RUN npm install     # Cached until package.json changes
COPY . .
```

### ❌ No .dockerignore
Sends node_modules, .git, .env to Docker → slow builds, security risk

✅ **Fix**: Create .dockerignore
```
node_modules
.git
.env
```

## Hands-On Exercise

Try building and running this simple app:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build
docker build -t my-first-app .

# Run
docker run -p 3000:3000 my-first-app

# Test
curl http://localhost:3000
```

## Next Steps

- [Dockerfile Guide](02-dockerfile-guide.md)
- [Docker Compose](03-docker-compose.md)
```

### Step 3: Troubleshooting Guide (docs/05-troubleshooting.md)
```markdown
# Troubleshooting Guide

## Common Issues & Solutions

### 1. "Port is already allocated"

**Error**:
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Cause**: Another process using the port

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 my-app
```

### 2. "Cannot connect to Docker daemon"

**Error**:
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

**Solution**:
- Start Docker Desktop
- On Linux: `sudo systemctl start docker`
- Check status: `docker info`

### 3. Frontend Can't Reach Backend

**Symptoms**: Network errors in browser console

**Solution**:
Check environment variables:
```bash
# In frontend container
echo $VITE_API_URL  # Should be http://backend:3000
```

Update docker-compose.yml:
```yaml
frontend:
  environment:
    VITE_API_URL: http://backend:3000
```

### 4. Database Connection Failed

**Error**:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
Use service name, not localhost:
```javascript
// ❌ Wrong
host: 'localhost'

// ✅ Correct
host: 'postgres'  // Docker service name
```

### 5. "No space left on device"

**Cause**: Docker images/containers filling disk

**Solution**:
```bash
# Remove unused data
docker system prune -a

# Check disk usage
docker system df
```

### 6. Build Fails: "npm ERR! network"

**Cause**: Network issues during npm install

**Solution**:
```bash
# Clear Docker build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

### 7. Hot Reload Not Working

**Cause**: Volume mount incorrect

**Solution**:
Check docker-compose.yml:
```yaml
volumes:
  - ./backend/src:/app/src  # Mount source directory
  - /app/node_modules       # Preserve node_modules
```

### 8. Permission Denied in Container

**Cause**: File ownership mismatch

**Solution**:
```bash
# In Dockerfile
RUN chown -R appuser:appuser /app
USER appuser
```

## Debugging Tips

### View Container Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend -f

# Last 50 lines
docker-compose logs --tail=50
```

### Execute Commands in Container
```bash
# Get shell access
docker-compose exec backend sh

# Run single command
docker-compose exec backend ls -la

# Check environment
docker-compose exec backend env
```

### Inspect Container
```bash
# View container config
docker inspect <container-id>

# Check networks
docker network ls
docker network inspect classroom-network

# Check volumes
docker volume ls
docker volume inspect classroom_postgres_data
```

### Rebuild Specific Service
```bash
# Rebuild and restart backend only
docker-compose up -d --build backend
```

## Performance Issues

### Slow Build Times

**Solutions**:
1. Use .dockerignore to exclude unnecessary files
2. Leverage build cache (copy package.json before source)
3. Use smaller base images (alpine)

### High Memory Usage

**Solution**: Set resource limits in docker-compose.yml
```yaml
deploy:
  resources:
    limits:
      memory: 512M
```

## Getting Help

1. Check Docker logs first
2. Verify environment variables
3. Test services individually
4. Ask for help with specific error messages

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Troubleshooting](https://docs.docker.com/compose/faq/)
```

## Todo List

- [ ] Write main README.md with quick start
- [ ] Create docs/00-getting-started.md
- [ ] Create docs/01-docker-basics.md (concepts, commands)
- [ ] Create docs/02-dockerfile-guide.md (writing Dockerfiles)
- [ ] Create docs/03-docker-compose.md (orchestration)
- [ ] Create docs/04-cicd-introduction.md (GitHub Actions)
- [ ] Create docs/05-troubleshooting.md (common issues)
- [ ] Create docs/06-best-practices.md (production patterns)
- [ ] Create docs/07-glossary.md (terminology)
- [ ] Add diagrams to key concepts
- [ ] Review for clarity and completeness
- [ ] Test all code examples

## Success Criteria

✅ README provides clear project overview
✅ Setup instructions work for beginners
✅ Docker concepts explained simply
✅ All code examples tested and working
✅ Troubleshooting covers common issues
✅ Best practices based on research findings
✅ Progressive learning path clear
✅ Documentation searchable with good structure

## Risk Assessment

**Low Risk**: Documentation completeness
- **Issue**: Missing edge cases or concepts
- **Mitigation**: Review with test students, iterate

## Security Considerations

- No credentials in documentation examples
- Security best practices highlighted
- .env templates show safe patterns

## Next Steps

→ Proceed to Phase 06: Student Assignments & Exercises
- Dependency: Documentation provides foundation
- Assignments reference these learning materials

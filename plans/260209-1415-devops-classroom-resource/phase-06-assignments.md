# Phase 06: Student Assignments & Exercises

**Context Links**: [Plan Overview](plan.md) | [Phase 05](phase-05-learning-materials.md) | [Research: Classroom Auto-grading](research/researcher-02-classroom-autograding.md)

## Overview

**Date**: 2026-02-09
**Description**: Create 7 progressive assignments with starter code and clear instructions
**Priority**: P1 (Critical - Core student experience)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 4h

## Key Insights

From research:
- **Progressive complexity**: Start simple (docker build) → advanced (deployment)
- **Starter code with TODOs**: Guide students without giving away answers
- **Clear success criteria**: Students know when they're done
- **Common mistakes**: Address proactively in instructions

## Requirements

### Functional Requirements
- 7 assignment modules with increasing difficulty
- Starter code for each module
- Clear TODO markers for student tasks
- Expected outcomes documented
- Testing instructions
- Reference solutions (instructor only)

### Module Breakdown
1. **Module 01**: Dockerize backend (basic Dockerfile)
2. **Module 02**: Dockerize frontend (build + nginx)
3. **Module 03**: Docker Compose (multi-service)
4. **Module 04**: Multi-stage builds (optimization)
5. **Module 05**: GitHub Actions CI (basic)
6. **Module 06**: Complete pipeline (test + build + deploy)
7. **Module 07**: VM deployment (production)

## Architecture

### Assignment Structure (Each Module)
```
module-XX-name/
├── README.md              # Instructions, objectives, success criteria
├── starter/               # Incomplete code for students
│   ├── Dockerfile         # With TODOs
│   └── ...
├── solution/              # Complete reference (instructor)
│   ├── Dockerfile
│   └── ...
├── tests/                 # Validation scripts
│   └── test.sh
└── .github/
    └── classroom/
        └── autograding.json
```

## Related Code Files

### Files to Create
**Module 01**:
- `assignments/module-01-dockerize-backend/README.md`
- `assignments/module-01-dockerize-backend/starter/Dockerfile`
- `assignments/module-01-dockerize-backend/solution/Dockerfile`
- `assignments/module-01-dockerize-backend/tests/test.sh`

**Module 02-07**: Similar structure for each

## Implementation Steps

### Step 1: Module 01 - Dockerize Backend

**README.md**:
```markdown
# Module 01: Dockerize the Backend

## 🎯 Learning Objectives

- Understand Dockerfile basics
- Build a Node.js container
- Run containers with port mapping
- Use environment variables

## 📋 Prerequisites

- Completed [Docker Basics](../../docs/01-docker-basics.md)
- Docker Desktop running

## 📝 Assignment

Create a Dockerfile for the backend API that:
1. Uses Node.js 20 Alpine base image
2. Copies and installs dependencies
3. Copies source code
4. Exposes port 3000
5. Runs the application

## 🚀 Getting Started

1. Navigate to starter directory:
```bash
cd assignments/module-01-dockerize-backend/starter
```

2. Complete TODOs in `Dockerfile`

3. Build your image:
```bash
docker build -t backend-app .
```

4. Run your container:
```bash
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=classroom_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  backend-app
```

5. Test the API:
```bash
curl http://localhost:3000/health
```

## ✅ Success Criteria

- [ ] Dockerfile builds without errors
- [ ] Container starts successfully
- [ ] Health endpoint returns 200 OK
- [ ] Image size < 200MB
- [ ] All TODOs completed

## 🧪 Testing Your Solution

```bash
# Run provided test script
./tests/test.sh

# Or manually test
docker build -t backend-test .
docker run -d -p 3000:3000 --name backend-test \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  backend-test

# Check health
curl http://localhost:3000/health

# Cleanup
docker stop backend-test && docker rm backend-test
```

## 💡 Hints

<details>
<summary>Hint 1: Base Image</summary>
Use `FROM node:20-alpine` for a small, secure base image.
</details>

<details>
<summary>Hint 2: Working Directory</summary>
Set `WORKDIR /app` to organize files in the container.
</details>

<details>
<summary>Hint 3: Layer Caching</summary>
Copy `package*.json` before source code for better caching.
</details>

## 🚫 Common Mistakes

1. **Copying before installing**: Results in slow rebuilds
   ```dockerfile
   # ❌ Wrong order
   COPY . .
   RUN npm install
   ```

2. **Forgetting to expose port**: Container can't be accessed
   ```dockerfile
   # ✅ Don't forget
   EXPOSE 3000
   ```

3. **Using root user**: Security risk (fixed in Module 04)

## 📚 Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Build Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Troubleshooting

**Build fails with "npm ERR!"**
- Check internet connection
- Try `npm ci` instead of `npm install`

**Container exits immediately**
- Check logs: `docker logs <container-id>`
- Verify CMD is correct

**Can't connect to database**
- Use `host.docker.internal` for Mac/Windows
- Use host IP for Linux

## 📤 Submission

1. Ensure all tests pass
2. Commit your Dockerfile
3. Push to your repository
4. GitHub Classroom will auto-grade

## 🏆 Bonus Challenges

- Add a .dockerignore file
- Make image even smaller (< 150MB)
- Add a health check instruction
```

**Starter Dockerfile**:
```dockerfile
# Module 01: Dockerize the Backend
# Complete the TODOs to create a working Dockerfile

# TODO 1: Choose appropriate base image
# Hint: Use Node.js 20 with Alpine Linux for smaller size
FROM ____

# TODO 2: Set working directory
# Hint: Use /app as the working directory
____

# TODO 3: Copy package files
# Hint: Copy package.json and package-lock.json
____

# TODO 4: Install dependencies
# Hint: Use npm ci for faster, more reliable installs
____

# TODO 5: Copy source code
# Hint: Copy everything from current directory
____

# TODO 6: Expose the port
# Hint: Backend runs on port 3000
____

# TODO 7: Define start command
# Hint: Use npm start to run the application
____
```

**Solution Dockerfile**:
```dockerfile
# Module 01: Backend Dockerfile Solution

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

**Test Script** (tests/test.sh):
```bash
#!/bin/bash
set -e

echo "Testing Module 01: Dockerize Backend"

# Build image
echo "Building Docker image..."
docker build -t module-01-test .

# Run container
echo "Starting container..."
CONTAINER_ID=$(docker run -d -p 3001:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=classroom_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  module-01-test)

# Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)

# Cleanup
echo "Cleaning up..."
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
docker rmi module-01-test

# Verify
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Test passed! Health endpoint returned 200"
  exit 0
else
  echo "❌ Test failed! Health endpoint returned $HTTP_CODE"
  exit 1
fi
```

### Step 2: Module 03 - Docker Compose

**README.md** (abbreviated):
```markdown
# Module 03: Docker Compose Setup

## 🎯 Learning Objectives

- Orchestrate multiple services
- Configure service dependencies
- Use Docker networks
- Persist data with volumes

## 📝 Assignment

Create `docker-compose.yml` that:
1. Defines PostgreSQL service
2. Defines backend service with dependency on database
3. Defines frontend service with dependency on backend
4. Configures networking between services
5. Sets up volume for database persistence

## ✅ Success Criteria

- [ ] All services start with `docker-compose up`
- [ ] Frontend accessible at http://localhost
- [ ] Backend API accessible at http://localhost:3000
- [ ] Database data persists after restart
- [ ] Services can communicate

## 🧪 Testing

```bash
docker-compose up -d
curl http://localhost/
curl http://localhost:3000/health
docker-compose down
```
```

**Starter docker-compose.yml**:
```yaml
version: '3.9'

services:
  # TODO 1: Define PostgreSQL service
  postgres:
    # TODO: Use postgres:16-alpine image
    image: ____
    # TODO: Set environment variables (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
    environment:
      ____
    # TODO: Map port 5432
    ports:
      ____
    # TODO: Add volume for data persistence
    volumes:
      ____

  # TODO 2: Define backend service
  backend:
    # TODO: Build from ./backend directory
    build: ____
    # TODO: Map port 3000
    ports:
      ____
    # TODO: Set environment variables to connect to postgres service
    environment:
      NODE_ENV: development
      PORT: 3000
      # TODO: Add database connection variables
      ____
    # TODO: Add dependency on postgres service
    depends_on:
      ____

  # TODO 3: Define frontend service
  frontend:
    # TODO: Build from ./frontend directory
    build: ____
    # TODO: Map port 80
    ports:
      ____
    # TODO: Set API URL environment variable
    environment:
      ____
    # TODO: Add dependency on backend
    depends_on:
      ____

# TODO 4: Define named volumes
volumes:
  ____
```

### Step 3: Module 07 - VM Deployment

**README.md**:
```markdown
# Module 07: Deploy to VM with Docker Compose

## 🎯 Learning Objectives

- Deploy to remote VM via SSH
- Use production Docker Compose configuration
- Implement deployment automation
- Monitor deployed application

## 📝 Assignment

Deploy the application to a VM using:
1. Production docker-compose configuration
2. SSH for remote access
3. Environment variables for secrets
4. Health checks for validation

## 🚀 Setup

1. **Prepare VM**:
   - Install Docker and Docker Compose
   - Configure SSH access
   - Open required ports (80, 443)

2. **Configure Secrets**:
   - Add SSH key to GitHub Secrets
   - Add production environment variables

3. **Deploy**:
```bash
# Copy files to VM
scp -r . user@vm-ip:/app

# SSH to VM
ssh user@vm-ip

# Deploy
cd /app
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## ✅ Success Criteria

- [ ] Application accessible via VM public IP
- [ ] Production environment variables configured
- [ ] All services running and healthy
- [ ] Database data persisted
- [ ] Logs available for debugging

## 🧪 Testing

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://<vm-ip>/
curl http://<vm-ip>/api/todos

# Check health
docker-compose exec backend wget -q -O- http://localhost:3000/health
```
```

## Todo List

- [ ] Create Module 01 README with instructions
- [ ] Create Module 01 starter Dockerfile with TODOs
- [ ] Create Module 01 solution Dockerfile
- [ ] Create Module 01 test script
- [ ] Create Module 02 (frontend Dockerfile)
- [ ] Create Module 03 (docker-compose)
- [ ] Create Module 04 (multi-stage builds)
- [ ] Create Module 05 (basic GitHub Actions CI)
- [ ] Create Module 06 (complete CI/CD pipeline)
- [ ] Create Module 07 (VM deployment)
- [ ] Test all starter code builds/runs
- [ ] Verify all solutions work
- [ ] Test all test scripts
- [ ] Create instructor guide for each module

## Success Criteria

✅ All 7 modules have complete READMEs
✅ Starter code is incomplete but buildable
✅ TODOs clearly guide students
✅ Solutions provide complete reference
✅ Test scripts validate success criteria
✅ Progressive difficulty from simple to advanced
✅ Each module builds on previous knowledge
✅ Common mistakes addressed in hints

## Risk Assessment

**High Risk**: Assignment difficulty mismatch
- **Issue**: Too hard or too easy for students
- **Mitigation**: Test with sample students, provide hints, clear success criteria

**Medium Risk**: Unclear instructions
- **Issue**: Students don't know what to do
- **Mitigation**: Step-by-step guides, examples, hints

## Security Considerations

- Solution files separated from starter
- No credentials in assignments
- .env.example for sensitive values
- SSH key management in Module 07

## Next Steps

→ Proceed to Phase 07: Auto-Grading System
- Dependency: Assignments with clear success criteria
- Auto-grading validates these criteria

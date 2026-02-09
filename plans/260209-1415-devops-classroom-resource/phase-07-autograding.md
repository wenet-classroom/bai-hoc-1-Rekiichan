# Phase 07: Auto-Grading System

**Context Links**: [Plan Overview](plan.md) | [Phase 06](phase-06-assignments.md) | [Research: Auto-grading](research/researcher-02-classroom-autograding.md)

## Overview

**Date**: 2026-02-09
**Description**: Implement GitHub Classroom auto-grading with Docker validation
**Priority**: P1 (Critical - Automated assessment)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 4h

## Key Insights

From research:
- **Progressive validation**: Module 1-2 use simple tests, 5-7 use complex workflows
- **Helpful feedback**: Catch common mistakes with clear messages
- **GitHub Actions**: Validate Docker builds, container health, API endpoints
- **Modular tests**: Each module has specific validation workflow

## Requirements

### Functional Requirements
- GitHub Classroom configuration (`.github/classroom/autograding.json`)
- Auto-grading workflows for each module
- Docker build validation
- Container health checks
- API endpoint testing
- docker-compose validation
- Helpful error messages
- Points system integration

### Validation Per Module
1. **Module 01**: Docker build succeeds, container runs, health check passes
2. **Module 02**: Frontend build succeeds, nginx serves files
3. **Module 03**: docker-compose up succeeds, all services healthy
4. **Module 04**: Multi-stage build smaller than single-stage
5. **Module 05**: CI workflow runs tests successfully
6. **Module 06**: Full pipeline builds and pushes image
7. **Module 07**: Deployment script validates deployment

## Architecture

### GitHub Actions Workflow Structure
```
.github/
├── classroom/
│   └── autograding.json          # Point assignments
└── workflows/
    ├── module-01-grading.yml      # Backend Docker
    ├── module-02-grading.yml      # Frontend Docker
    ├── module-03-grading.yml      # Docker Compose
    ├── module-04-grading.yml      # Multi-stage
    ├── module-05-grading.yml      # Basic CI
    ├── module-06-grading.yml      # Full pipeline
    └── module-07-grading.yml      # Deployment
```

### Validation Flow
```
Push to GitHub
    ↓
GitHub Actions Triggered
    ↓
Checkout Code
    ↓
Run Module-Specific Tests
    ↓
Validate Docker Build/Run
    ↓
Check Success Criteria
    ↓
Report Results + Points
```

## Related Code Files

### Files to Create
- `.github/classroom/autograding.json` - Points configuration
- `.github/workflows/module-01-grading.yml` - Backend validation
- `.github/workflows/module-02-grading.yml` - Frontend validation
- `.github/workflows/module-03-grading.yml` - Compose validation
- `.github/workflows/module-04-grading.yml` - Multi-stage validation
- `.github/workflows/module-05-grading.yml` - CI validation
- `.github/workflows/module-06-grading.yml` - Pipeline validation
- `.github/workflows/module-07-grading.yml` - Deployment validation

## Implementation Steps

### Step 1: Autograding Configuration (.github/classroom/autograding.json)
```json
{
  "tests": [
    {
      "name": "Module 01: Backend Dockerfile",
      "setup": "",
      "run": "bash assignments/module-01-dockerize-backend/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 10,
      "points": 10
    },
    {
      "name": "Module 02: Frontend Dockerfile",
      "setup": "",
      "run": "bash assignments/module-02-dockerize-frontend/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 10,
      "points": 10
    },
    {
      "name": "Module 03: Docker Compose",
      "setup": "",
      "run": "bash assignments/module-03-docker-compose/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 15,
      "points": 15
    },
    {
      "name": "Module 04: Multi-stage Builds",
      "setup": "",
      "run": "bash assignments/module-04-multi-stage-builds/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 15,
      "points": 15
    },
    {
      "name": "Module 05: Basic CI",
      "setup": "",
      "run": "bash assignments/module-05-basic-ci/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 10,
      "points": 15
    },
    {
      "name": "Module 06: Complete Pipeline",
      "setup": "",
      "run": "bash assignments/module-06-complete-pipeline/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 20,
      "points": 20
    },
    {
      "name": "Module 07: VM Deployment",
      "setup": "",
      "run": "bash assignments/module-07-vm-deployment/tests/test.sh",
      "input": "",
      "output": "",
      "comparison": "included",
      "timeout": 30,
      "points": 15
    }
  ]
}
```

### Step 2: Module 01 Grading Workflow
```yaml
name: Module 01 - Backend Docker Grading

on:
  push:
    paths:
      - 'assignments/module-01-dockerize-backend/**'
      - 'backend/**'
  pull_request:
    paths:
      - 'assignments/module-01-dockerize-backend/**'

jobs:
  grade-module-01:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Validate Dockerfile exists
        run: |
          if [ ! -f "assignments/module-01-dockerize-backend/starter/Dockerfile" ]; then
            echo "❌ Dockerfile not found in starter directory"
            exit 1
          fi
          echo "✅ Dockerfile found"

      - name: Check for common mistakes
        run: |
          # Check for 'latest' tag usage
          if grep -q "FROM.*:latest" assignments/module-01-dockerize-backend/starter/Dockerfile; then
            echo "⚠️  Warning: Using 'latest' tag is not recommended. Pin to specific version."
          fi

          # Check for EXPOSE instruction
          if ! grep -q "EXPOSE" assignments/module-01-dockerize-backend/starter/Dockerfile; then
            echo "❌ Missing EXPOSE instruction"
            exit 1
          fi
          echo "✅ EXPOSE instruction found"

      - name: Build Docker image
        working-directory: assignments/module-01-dockerize-backend/starter
        run: |
          docker build -t backend-test . 2>&1 | tee build.log

          # Check build success
          if [ $? -ne 0 ]; then
            echo "❌ Docker build failed. Check the error messages above."
            exit 1
          fi
          echo "✅ Docker build succeeded"

      - name: Check image size
        run: |
          IMAGE_SIZE=$(docker image inspect backend-test --format='{{.Size}}')
          IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))
          echo "Image size: ${IMAGE_SIZE_MB}MB"

          if [ $IMAGE_SIZE_MB -gt 300 ]; then
            echo "⚠️  Warning: Image size is ${IMAGE_SIZE_MB}MB. Consider optimizing (target: < 200MB)"
          else
            echo "✅ Image size is acceptable"
          fi

      - name: Start PostgreSQL for testing
        run: |
          docker run -d \
            --name postgres-test \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -e POSTGRES_DB=classroom_db \
            -p 5432:5432 \
            postgres:16-alpine

          # Wait for postgres to be ready
          sleep 10

      - name: Run container
        run: |
          docker run -d \
            --name backend-test \
            -p 3000:3000 \
            -e NODE_ENV=development \
            -e PORT=3000 \
            -e DB_HOST=172.17.0.1 \
            -e DB_PORT=5432 \
            -e DB_NAME=classroom_db \
            -e DB_USER=postgres \
            -e DB_PASSWORD=postgres \
            backend-test

          echo "✅ Container started"

      - name: Wait for application to be ready
        run: |
          echo "Waiting for application to start..."
          for i in {1..30}; do
            if curl -f http://localhost:3000/health > /dev/null 2>&1; then
              echo "✅ Application is ready"
              exit 0
            fi
            echo "Waiting... ($i/30)"
            sleep 2
          done
          echo "❌ Application failed to start within 60 seconds"
          docker logs backend-test
          exit 1

      - name: Test health endpoint
        run: |
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

          if [ "$HTTP_CODE" -eq 200 ]; then
            echo "✅ Health endpoint returned 200 OK"
          else
            echo "❌ Health endpoint returned $HTTP_CODE (expected 200)"
            docker logs backend-test
            exit 1
          fi

      - name: Verify container is using non-root user (Bonus)
        run: |
          USER=$(docker exec backend-test whoami)
          if [ "$USER" != "root" ]; then
            echo "🏆 Bonus: Container running as non-root user ($USER)"
          else
            echo "⚠️  Info: Container running as root. Consider adding non-root user in future modules."
          fi

      - name: Cleanup
        if: always()
        run: |
          docker stop backend-test postgres-test || true
          docker rm backend-test postgres-test || true
          docker rmi backend-test || true

      - name: Summary
        if: success()
        run: |
          echo "================================================"
          echo "✅ Module 01 Grading: PASSED"
          echo "================================================"
          echo "✓ Dockerfile exists and is valid"
          echo "✓ Docker build succeeded"
          echo "✓ Container runs without errors"
          echo "✓ Health endpoint responds correctly"
          echo "================================================"
          echo "Points earned: 10/10"
```

### Step 3: Module 03 Docker Compose Grading
```yaml
name: Module 03 - Docker Compose Grading

on:
  push:
    paths:
      - 'assignments/module-03-docker-compose/**'
      - 'docker-compose.yml'

jobs:
  grade-module-03:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Validate docker-compose.yml exists
        run: |
          if [ ! -f "docker-compose.yml" ]; then
            echo "❌ docker-compose.yml not found in root"
            exit 1
          fi
          echo "✅ docker-compose.yml found"

      - name: Validate compose file syntax
        run: |
          docker-compose config > /dev/null
          if [ $? -ne 0 ]; then
            echo "❌ docker-compose.yml has syntax errors"
            exit 1
          fi
          echo "✅ docker-compose.yml syntax is valid"

      - name: Check required services
        run: |
          SERVICES=$(docker-compose config --services)

          if ! echo "$SERVICES" | grep -q "postgres"; then
            echo "❌ Missing 'postgres' service"
            exit 1
          fi

          if ! echo "$SERVICES" | grep -q "backend"; then
            echo "❌ Missing 'backend' service"
            exit 1
          fi

          if ! echo "$SERVICES" | grep -q "frontend"; then
            echo "❌ Missing 'frontend' service"
            exit 1
          fi

          echo "✅ All required services defined"

      - name: Check for volumes
        run: |
          if ! docker-compose config | grep -q "volumes:"; then
            echo "⚠️  Warning: No volumes defined for data persistence"
          else
            echo "✅ Volumes configured"
          fi

      - name: Start services
        run: |
          docker-compose up -d
          echo "✅ Services started"

      - name: Wait for services to be healthy
        run: |
          echo "Waiting for services to be ready..."
          sleep 30

      - name: Check service status
        run: |
          docker-compose ps

          # Check if all services are running
          RUNNING=$(docker-compose ps --services --filter "status=running" | wc -l)
          TOTAL=$(docker-compose ps --services | wc -l)

          if [ "$RUNNING" -eq "$TOTAL" ]; then
            echo "✅ All services running ($RUNNING/$TOTAL)"
          else
            echo "❌ Not all services running ($RUNNING/$TOTAL)"
            docker-compose logs
            exit 1
          fi

      - name: Test backend health
        run: |
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

          if [ "$HTTP_CODE" -eq 200 ]; then
            echo "✅ Backend health check passed"
          else
            echo "❌ Backend health check failed (HTTP $HTTP_CODE)"
            docker-compose logs backend
            exit 1
          fi

      - name: Test frontend accessibility
        run: |
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)

          if [ "$HTTP_CODE" -eq 200 ]; then
            echo "✅ Frontend accessible"
          else
            echo "❌ Frontend not accessible (HTTP $HTTP_CODE)"
            docker-compose logs frontend
            exit 1
          fi

      - name: Test service communication
        run: |
          # Create a test todo
          RESPONSE=$(curl -s -X POST http://localhost:3000/api/todos \
            -H "Content-Type: application/json" \
            -d '{"title":"Test Todo","description":"Testing inter-service communication"}')

          if echo "$RESPONSE" | grep -q "success"; then
            echo "✅ Services can communicate"
          else
            echo "❌ Service communication failed"
            echo "Response: $RESPONSE"
            exit 1
          fi

      - name: Test data persistence
        run: |
          echo "Testing data persistence..."

          # Get todo count
          BEFORE=$(curl -s http://localhost:3000/api/todos | grep -o '"id":' | wc -l)

          # Restart services
          docker-compose restart
          sleep 15

          # Check todo count again
          AFTER=$(curl -s http://localhost:3000/api/todos | grep -o '"id":' | wc -l)

          if [ "$AFTER" -ge "$BEFORE" ]; then
            echo "✅ Data persisted after restart"
          else
            echo "❌ Data lost after restart"
            exit 1
          fi

      - name: Cleanup
        if: always()
        run: |
          docker-compose down -v
          docker system prune -af

      - name: Summary
        if: success()
        run: |
          echo "================================================"
          echo "✅ Module 03 Grading: PASSED"
          echo "================================================"
          echo "✓ docker-compose.yml valid"
          echo "✓ All services start successfully"
          echo "✓ Backend health check passes"
          echo "✓ Frontend accessible"
          echo "✓ Services communicate correctly"
          echo "✓ Data persists across restarts"
          echo "================================================"
          echo "Points earned: 15/15"
```

### Step 4: Common Feedback Messages Script
```bash
#!/bin/bash
# Common feedback for students

provide_feedback() {
  local error_type=$1

  case $error_type in
    "dockerfile_not_found")
      echo "================================================"
      echo "❌ ERROR: Dockerfile not found"
      echo "================================================"
      echo "Make sure you have created a Dockerfile in the"
      echo "correct location. Check the assignment instructions."
      echo "================================================"
      ;;

    "build_failed")
      echo "================================================"
      echo "❌ ERROR: Docker build failed"
      echo "================================================"
      echo "Common causes:"
      echo "1. Syntax errors in Dockerfile"
      echo "2. Invalid base image"
      echo "3. Missing files being copied"
      echo "4. npm install failures"
      echo ""
      echo "Tips:"
      echo "- Check the build log above for specific errors"
      echo "- Ensure all files referenced exist"
      echo "- Try building locally first"
      echo "================================================"
      ;;

    "container_failed")
      echo "================================================"
      echo "❌ ERROR: Container failed to start"
      echo "================================================"
      echo "Common causes:"
      echo "1. Application crashes on startup"
      echo "2. Port already in use"
      echo "3. Missing environment variables"
      echo "4. Database connection issues"
      echo ""
      echo "Tips:"
      echo "- Check container logs with 'docker logs <container>'"
      echo "- Verify all environment variables are set"
      echo "- Test locally with 'docker run'"
      echo "================================================"
      ;;

    "health_check_failed")
      echo "================================================"
      echo "❌ ERROR: Health check failed"
      echo "================================================"
      echo "The application started but didn't respond correctly."
      echo ""
      echo "Common causes:"
      echo "1. Wrong port exposed"
      echo "2. Application not fully initialized"
      echo "3. Database connection issues"
      echo ""
      echo "Tips:"
      echo "- Verify EXPOSE instruction matches app port"
      echo "- Check if database is accessible"
      echo "- Look at application logs for errors"
      echo "================================================"
      ;;
  esac
}
```

## Todo List

- [ ] Create autograding.json with point assignments
- [ ] Create Module 01 grading workflow (backend Docker)
- [ ] Create Module 02 grading workflow (frontend Docker)
- [ ] Create Module 03 grading workflow (docker-compose)
- [ ] Create Module 04 grading workflow (multi-stage)
- [ ] Create Module 05 grading workflow (basic CI)
- [ ] Create Module 06 grading workflow (full pipeline)
- [ ] Create Module 07 grading workflow (deployment)
- [ ] Create feedback message helper script
- [ ] Test all workflows locally with act
- [ ] Verify helpful error messages display
- [ ] Test point calculation
- [ ] Create instructor dashboard for monitoring

## Success Criteria

✅ Auto-grading workflows trigger on push
✅ All module validations work correctly
✅ Docker builds validated successfully
✅ Container health checks functional
✅ Helpful error messages provide guidance
✅ Points calculated and reported accurately
✅ Workflows complete in reasonable time (< 5 min)
✅ Common mistakes caught with specific feedback

## Risk Assessment

**High Risk**: Workflow timeouts
- **Issue**: Complex Docker operations exceed time limits
- **Mitigation**: Optimize builds, use caching, set appropriate timeouts

**Medium Risk**: Flaky tests
- **Issue**: Intermittent failures due to timing
- **Mitigation**: Add proper wait conditions, retries, health checks

**Low Risk**: GitHub Actions quota
- **Issue**: Too many workflow runs
- **Mitigation**: Trigger only on relevant path changes

## Security Considerations

- No secrets in workflow files
- Use GitHub Secrets for sensitive data
- Clean up containers after tests
- Limit workflow permissions
- Validate student code in isolated environment

## Next Steps

✅ **All Implementation Phases Complete**

### Post-Implementation Tasks:
1. Test complete workflow end-to-end
2. Create instructor setup guide
3. Prepare demo for students
4. Set up GitHub Classroom organization
5. Create first assignment from template

### Documentation to Create:
- Instructor guide for setting up assignments
- Student onboarding guide
- FAQ based on common issues
- Video tutorials (optional)

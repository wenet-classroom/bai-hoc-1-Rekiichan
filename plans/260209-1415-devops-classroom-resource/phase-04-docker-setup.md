# Phase 04: Docker Setup & Configurations

**Context Links**: [Plan Overview](plan.md) | [Phase 03](phase-03-frontend.md) | [Research: Docker Teaching](research/researcher-01-docker-teaching.md)

## Overview

**Date**: 2026-02-09
**Description**: Create Dockerfiles, docker-compose configurations, and container orchestration
**Priority**: P1 (Critical - Core learning objective)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 3h

## Key Insights

From research findings:
- **Layer caching**: Dependencies before code copy critical for build performance
- **Multi-stage builds**: Separate build/runtime for smaller images
- **Security**: Non-root users, pinned versions, no secrets in layers
- **Development vs Production**: Different compose configurations
- **.dockerignore**: Essential from day one to prevent bloated images

## Requirements

### Functional Requirements
- Backend Dockerfile with multi-stage build
- Frontend Dockerfile with multi-stage build + nginx
- docker-compose.yml for development
- docker-compose.prod.yml override for production
- .dockerignore files for both services
- PostgreSQL service configuration
- Health checks for all services
- Volume management for development and data persistence

### Non-Functional Requirements
- Fast build times with layer caching
- Small production images (< 200MB for Node services)
- Security: non-root users, no secrets
- Clear comments explaining each Dockerfile instruction
- Easy local development setup (single command)

## Architecture

### Container Structure
```
┌─────────────────────────────────────────┐
│         Docker Compose Network          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ Frontend │  │ Backend  │  │  DB   ││
│  │  Nginx   │  │  Node.js │  │ PG    ││
│  │  :80     │→ │  :3000   │→ │ :5432 ││
│  └──────────┘  └──────────┘  └───────┘│
│      ↑              ↑             ↑    │
│    volumes      volumes      volumes   │
└─────────────────────────────────────────┘
```

### Build Stages
**Backend**: Node build → Production runtime
**Frontend**: Node build → Nginx production serve

## Related Code Files

### Files to Create
- `backend/Dockerfile` - Multi-stage backend image
- `backend/.dockerignore` - Exclude unnecessary files
- `frontend/Dockerfile` - Multi-stage frontend image
- `frontend/.dockerignore` - Exclude unnecessary files
- `frontend/nginx.conf` - Nginx configuration
- `docker-compose.yml` - Development orchestration
- `docker-compose.prod.yml` - Production overrides
- `.env.docker` - Docker environment variables

### Files to Modify
None (new Docker configurations)

## Implementation Steps

### Step 1: Backend .dockerignore
```dockerignore
node_modules
npm-debug.log
.env
.env.*
.git
.gitignore
coverage
dist
*.md
Dockerfile
.dockerignore
```

### Step 2: Backend Dockerfile (Multi-stage)
```dockerfile
# ==================================
# Stage 1: Dependencies
# ==================================
FROM node:20-alpine AS deps

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# ==================================
# Stage 2: Development
# ==================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Install dev dependencies for development
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run as non-root user
USER nodejs

CMD ["npm", "run", "dev"]

# ==================================
# Stage 3: Production
# ==================================
FROM node:20-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy source code
COPY --chown=nodejs:nodejs . .

# Expose port
EXPOSE 3000

# Run as non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

CMD ["npm", "start"]
```

### Step 3: Frontend .dockerignore
```dockerignore
node_modules
npm-debug.log
.env
.env.*
.git
.gitignore
dist
coverage
*.md
Dockerfile
.dockerignore
```

### Step 4: Frontend Dockerfile (Multi-stage)
```dockerfile
# ==================================
# Stage 1: Build
# ==================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ==================================
# Stage 2: Production with Nginx
# ==================================
FROM nginx:1.25-alpine AS production

# Create nginx user
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Step 5: Nginx Configuration (frontend/nginx.conf)
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Serve index.html for all routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 6: Docker Compose (Development)
```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: classroom-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: classroom_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: classroom-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: classroom_db
      DB_USER: postgres
      DB_PASSWORD: postgres
    volumes:
      # Mount source code for hot reload
      - ./backend/src:/app/src
      # Preserve node_modules
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: classroom-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:3000
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local

networks:
  default:
    name: classroom-network
```

### Step 7: Production Override (docker-compose.prod.yml)
```yaml
version: '3.9'

services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-change_me_in_production}
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  backend:
    build:
      target: production
    environment:
      NODE_ENV: production
      DB_PASSWORD: ${DB_PASSWORD:-change_me_in_production}
    volumes: []  # Remove development volumes
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
      restart_policy:
        condition: on-failure
        max_attempts: 3

  frontend:
    environment:
      VITE_API_URL: ${API_URL:-http://localhost:3000}
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 128M
      restart_policy:
        condition: on-failure
        max_attempts: 3
```

### Step 8: Docker Environment Template (.env.docker)
```env
# Database
DB_PASSWORD=postgres
POSTGRES_PASSWORD=postgres

# Backend
NODE_ENV=production

# Frontend
API_URL=http://localhost:3000
```

### Step 9: Docker Commands Documentation
Create `docs/docker-commands.md`:
```markdown
# Docker Commands Reference

## Development
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

## Production
```bash
# Start with production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

## Useful Commands
```bash
# Check service status
docker-compose ps

# Execute command in container
docker-compose exec backend sh

# View backend logs
docker-compose logs backend -f

# Restart single service
docker-compose restart backend

# Remove volumes (clean state)
docker-compose down -v
```
```

## Todo List

- [ ] Create backend .dockerignore
- [ ] Create backend Dockerfile with multi-stage build
- [ ] Create frontend .dockerignore
- [ ] Create frontend Dockerfile with multi-stage build
- [ ] Create nginx.conf for frontend
- [ ] Create docker-compose.yml for development
- [ ] Create docker-compose.prod.yml for production
- [ ] Create .env.docker template
- [ ] Test backend Docker build
- [ ] Test frontend Docker build
- [ ] Test docker-compose up (all services)
- [ ] Verify health checks work
- [ ] Test volume persistence
- [ ] Create docker-commands.md documentation
- [ ] Test production compose override

## Success Criteria

✅ Backend Dockerfile builds without errors (< 2 min)
✅ Frontend Dockerfile builds without errors (< 3 min)
✅ docker-compose up starts all services successfully
✅ Can access frontend at http://localhost
✅ Can access backend at http://localhost:3000
✅ Database persists data after restart
✅ Health checks pass for all services
✅ Production images are small (< 200MB combined)
✅ Non-root users configured correctly
✅ Hot reload works in development mode

## Risk Assessment

**High Risk**: Multi-stage build complexity
- **Issue**: Students confused by build stages
- **Mitigation**: Extensive comments in Dockerfiles, visual diagrams

**Medium Risk**: Networking issues between containers
- **Issue**: Services can't communicate
- **Mitigation**: Health checks, depends_on conditions, clear error messages

**Low Risk**: Port conflicts
- **Issue**: Ports 80/3000/5432 already in use
- **Mitigation**: Document port configuration in .env

## Security Considerations

- ✅ Non-root users in all containers
- ✅ Pinned base image versions (node:20-alpine, postgres:16)
- ✅ No secrets in Dockerfiles
- ✅ .dockerignore prevents .env leakage
- ✅ Health checks for early failure detection
- ✅ Resource limits in production

## Next Steps

→ Proceed to Phase 05: Learning Materials & Documentation
- Dependency: Docker setup functional
- Document Docker concepts for students

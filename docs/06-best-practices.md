# Best Practices

## Security

### Use Non-Root Users
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### No Secrets in Images
```dockerfile
# Wrong - secret baked into image
ENV DB_PASSWORD=mysecret

# Correct - pass at runtime
# docker run -e DB_PASSWORD=mysecret myapp
```

### Pin Image Versions
```dockerfile
FROM node:20-alpine    # Good - pinned
FROM node:latest       # Bad - unpredictable
```

### Use .dockerignore
```
node_modules
.env
.git
```

## Performance

### Layer Caching
```dockerfile
# Dependencies change less often - cache this layer
COPY package*.json ./
RUN npm ci

# Source changes often - this layer rebuilds
COPY . .
```

### Multi-Stage Builds
Separate build tools from production runtime:
```dockerfile
FROM node:20-alpine AS build
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Minimal Base Images
| Image | Size |
|-------|------|
| node:20 | ~1GB |
| node:20-slim | ~200MB |
| node:20-alpine | ~130MB |

## Reliability

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Restart Policies
```yaml
services:
  backend:
    restart: unless-stopped
    # Options: no, always, on-failure, unless-stopped
```

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 256M
```

### Graceful Shutdown
```javascript
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully');
  await pool.end();
  process.exit(0);
});
```

## CI/CD Pipeline Design

### Pipeline Stages
1. **Lint** - Code style checks
2. **Test** - Unit and integration tests
3. **Build** - Create Docker images
4. **Push** - Push to container registry
5. **Deploy** - Update production

### Image Tagging
```bash
# Use git SHA for traceability
docker build -t myapp:$(git rev-parse --short HEAD) .

# Tag releases with semver
docker build -t myapp:1.0.0 .
```

## Monitoring

### Container Logs
```bash
docker compose logs -f --tail=100
```

### Resource Usage
```bash
docker stats
```

### Health Status
```bash
docker compose ps
docker inspect --format='{{.State.Health.Status}}' container-name
```

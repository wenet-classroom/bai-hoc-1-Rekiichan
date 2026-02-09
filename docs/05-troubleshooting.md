# Troubleshooting Guide

## Common Issues

### 1. "Port is already allocated"

```
Error: bind: address already in use
```

**Fix**: Find and stop the process using the port:
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Or use a different port
docker run -p 3001:3000 my-app
```

### 2. "Cannot connect to Docker daemon"

```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

**Fix**: Start Docker Desktop, or on Linux: `sudo systemctl start docker`

### 3. Frontend Can't Reach Backend

**Symptoms**: Network errors in browser console

**Fix**: Check environment variables and service names:
```yaml
# In docker-compose.yml, use service name as hostname
backend:
  environment:
    DB_HOST: postgres    # Not 'localhost'
```

### 4. Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix**: In Docker, use service name instead of localhost:
```javascript
// Wrong
host: 'localhost'

// Correct (Docker Compose)
host: 'postgres'
```

### 5. "No space left on device"

**Fix**: Clean up Docker resources:
```bash
docker system prune -a
docker volume prune
docker system df    # Check usage
```

### 6. Build Fails: npm Network Error

**Fix**:
```bash
docker builder prune           # Clear build cache
docker compose build --no-cache # Rebuild from scratch
```

### 7. Hot Reload Not Working

**Fix**: Check volume mounts in docker-compose.yml:
```yaml
volumes:
  - ./backend/src:/app/src    # Mount source
  - /app/node_modules         # Preserve node_modules
```

### 8. Permission Denied in Container

**Fix**: Set proper file ownership:
```dockerfile
COPY --chown=appuser:appuser . .
USER appuser
```

## Debugging Tips

### View Logs
```bash
docker compose logs              # All services
docker compose logs backend -f   # Follow specific service
docker compose logs --tail=50    # Last 50 lines
```

### Shell into Container
```bash
docker compose exec backend sh
docker compose exec postgres psql -U postgres
```

### Inspect Container
```bash
docker inspect <container-id>
docker network ls
docker volume ls
```

### Rebuild Single Service
```bash
docker compose up -d --build backend
```

## Performance Issues

### Slow Builds
1. Use .dockerignore
2. Copy package.json before source code
3. Use Alpine base images
4. Enable Docker BuildKit: `DOCKER_BUILDKIT=1`

### High Memory
Set resource limits:
```yaml
deploy:
  resources:
    limits:
      memory: 512M
```

## Getting Help

1. Read error messages carefully
2. Check container logs
3. Verify environment variables
4. Test services individually
5. Ask with specific error messages

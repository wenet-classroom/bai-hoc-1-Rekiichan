# Docker Compose

## What is Docker Compose?

Docker Compose orchestrates multiple containers as a single application. Define services, networks, and volumes in one YAML file.

## Why Use Docker Compose?

- **Single command**: `docker compose up` starts everything
- **Service discovery**: Containers find each other by name
- **Configuration as code**: Reproducible environments
- **Development/production parity**: Same setup everywhere

## File Structure

```yaml
version: '3.9'

services:
  service-name:
    image: image:tag
    ports:
      - "host:container"
    environment:
      KEY: value
    volumes:
      - ./local:/container
    depends_on:
      - other-service

volumes:
  data-volume:

networks:
  app-network:
```

## Key Concepts

### Services
Each service runs one container. Define image, ports, environment, volumes.

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: postgres
```

### Dependencies
Control startup order with `depends_on`:

```yaml
backend:
  depends_on:
    postgres:
      condition: service_healthy
```

### Health Checks
Ensure services are ready before dependents start:

```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Volumes
Persist data and share files:

```yaml
# Named volume (managed by Docker)
volumes:
  - postgres_data:/var/lib/postgresql/data

# Bind mount (host directory)
volumes:
  - ./backend/src:/app/src
```

### Networks
Services on the same network communicate by service name:

```yaml
# backend can reach postgres at hostname "postgres"
backend:
  environment:
    DB_HOST: postgres    # Service name = hostname
```

## Full Example

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pg_data:
```

## Common Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild and start
docker compose up --build

# Check status
docker compose ps

# Execute command in service
docker compose exec backend sh

# Remove volumes too
docker compose down -v
```

## Development vs Production

Use override files for different environments:

```bash
# Development (default)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Next Steps

- [CI/CD Introduction](04-cicd-introduction.md)
- [Troubleshooting](05-troubleshooting.md)

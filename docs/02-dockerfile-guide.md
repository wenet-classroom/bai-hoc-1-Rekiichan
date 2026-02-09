# Dockerfile Guide

## What is a Dockerfile?

A Dockerfile is a text file with instructions to build a Docker image. Each instruction creates a layer in the image.

## Instruction Reference

### FROM - Base Image
```dockerfile
FROM node:20-alpine
```
Always pin versions. Avoid `:latest`.

### WORKDIR - Working Directory
```dockerfile
WORKDIR /app
```
Sets the working directory for subsequent instructions.

### COPY - Copy Files
```dockerfile
COPY package*.json ./
COPY . .
```
Copy files from host to container. Copy dependency files first for better caching.

### RUN - Execute Commands
```dockerfile
RUN npm ci --only=production
RUN addgroup -S nodejs && adduser -S nodejs -u 1001
```
Runs commands during build. Combine related commands with `&&` to reduce layers.

### EXPOSE - Document Ports
```dockerfile
EXPOSE 3000
```
Documents which port the app uses. Does not actually publish the port.

### CMD - Default Command
```dockerfile
CMD ["npm", "start"]
```
The command to run when the container starts. Use exec form (JSON array).

### ENV - Environment Variables
```dockerfile
ENV NODE_ENV=production
```
Sets environment variables available at build time and runtime.

### HEALTHCHECK - Container Health
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```
Defines how Docker checks if the container is healthy.

### USER - Run as Non-Root
```dockerfile
RUN adduser -S appuser
USER appuser
```
Security best practice: never run as root in production.

## Multi-Stage Builds

Multi-stage builds create smaller, more secure images by separating build and runtime.

### Why Multi-Stage?
- Build dependencies stay out of production image
- Smaller final image (no compilers, dev tools)
- Better security (less attack surface)

### Example: Node.js Backend
```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:20-alpine AS production
RUN adduser -S appuser
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
CMD ["npm", "start"]
```

### Example: React Frontend with Nginx
```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Layer Caching

Docker caches layers. If a layer hasn't changed, Docker reuses it.

### Good Pattern (cache-friendly)
```dockerfile
COPY package*.json ./     # Changes rarely
RUN npm ci                # Cached until package.json changes
COPY . .                  # Changes often
```

### Bad Pattern (cache-busting)
```dockerfile
COPY . .                  # Any file change invalidates cache
RUN npm ci                # Reinstalls every time
```

## Best Practices

1. **Pin base image versions**: `node:20-alpine` not `node:latest`
2. **Use Alpine images**: Smaller base, fewer vulnerabilities
3. **Copy dependencies first**: Better layer caching
4. **Use .dockerignore**: Exclude node_modules, .git, .env
5. **Run as non-root**: Create and use a dedicated user
6. **Use multi-stage builds**: Separate build from runtime
7. **Minimize layers**: Combine RUN commands with `&&`
8. **Don't store secrets**: Use environment variables at runtime

## Next Steps

- [Docker Compose](03-docker-compose.md)
- [Best Practices](06-best-practices.md)

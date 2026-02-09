# Module 03: Docker Compose Setup

## Learning Objectives
- Orchestrate multiple services with Docker Compose
- Configure service dependencies and health checks
- Use Docker networks for inter-service communication
- Persist data with named volumes

## Prerequisites
- Completed Modules 01 and 02
- Read [Docker Compose](../../docs/03-docker-compose.md)

## Assignment

Create a docker-compose.yml that:
1. Defines PostgreSQL database service with health check
2. Defines backend service dependent on database
3. Defines frontend service dependent on backend
4. Configures networking between services
5. Sets up volume for database persistence

## Getting Started
```bash
cd assignments/module-03-docker-compose/starter
# Complete TODOs in docker-compose.yml
docker compose up
```

## Success Criteria
- [ ] All three services start with `docker compose up`
- [ ] Frontend accessible at http://localhost
- [ ] Backend API at http://localhost:3000/health
- [ ] Database persists data after restart
- [ ] Services communicate via Docker network

## Hints

<details>
<summary>Hint 1: Service Names</summary>
Use service name as hostname: DB_HOST=postgres (not localhost)
</details>

<details>
<summary>Hint 2: Health Checks</summary>
pg_isready -U postgres checks if PostgreSQL is accepting connections
</details>

<details>
<summary>Hint 3: Volumes</summary>
Define named volume under top-level volumes: key and reference in service
</details>

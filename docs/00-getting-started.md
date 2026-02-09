# Getting Started

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Docker Desktop 24+**: [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js 20+**: [Download](https://nodejs.org/) (for local development)
- **Git**: [Download](https://git-scm.com/)
- **Code Editor**: [VS Code](https://code.visualstudio.com/) recommended

### Verify Installation

```bash
# Check Docker
docker --version
docker-compose --version

# Check Node.js
node --version
npm --version

# Check Git
git --version
```

## Getting the Code

```bash
git clone <repo-url>
cd classroom-mvp
```

## Running with Docker (Recommended)

```bash
# Start all services
docker-compose up

# Access the app
# Frontend: http://localhost
# Backend:  http://localhost:3000
# Health:   http://localhost:3000/health
```

## Running Locally (Without Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

> **Note**: Local development requires a running PostgreSQL instance.

## Next Steps

- [Docker Basics](01-docker-basics.md) - Learn container fundamentals
- [Module 1](../assignments/module-01-dockerize-backend/README.md) - Start your first assignment

# Backend API

Node.js/Express REST API with PostgreSQL for the DevOps classroom todo application.

## Tech Stack
- Node.js 20
- Express 4.x
- PostgreSQL 16
- Jest (testing)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/todos | List all todos |
| GET | /api/todos/:id | Get single todo |
| POST | /api/todos | Create todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `.env.example` for required configuration.

## Testing

```bash
npm test
```

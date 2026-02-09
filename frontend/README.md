# Frontend UI

React 18 + Vite frontend for the DevOps classroom todo application.

## Tech Stack
- React 18
- Vite 5
- Axios (HTTP client)

## Components

| Component | Description |
|-----------|-------------|
| App | Root component with state management |
| TodoForm | Create new todos |
| TodoList | Display todo list |
| TodoItem | Individual todo with toggle/delete |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `.env.example` for required configuration.

## Building for Production

```bash
npm run build
```

Output goes to `dist/` directory.

# Phase 02: Simple Backend API Implementation

**Context Links**: [Plan Overview](plan.md) | [Phase 01](phase-01-foundation.md)

## Overview

**Date**: 2026-02-09
**Description**: Build Node.js/Express REST API with PostgreSQL for todos management
**Priority**: P1 (Critical - Core application logic)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 2h

## Key Insights

- Keep code simple and well-commented for learning purposes
- Use plain SQL instead of ORM to teach database fundamentals
- Each file should be under 200 lines for optimal readability
- Error handling must be explicit and educational
- Follow Express best practices (middleware, routing patterns)

## Requirements

### Functional Requirements
- REST API endpoints: GET, POST, PUT, DELETE for todos
- PostgreSQL database connection and queries
- CORS configuration for frontend access
- Environment-based configuration
- Basic error handling and validation
- Health check endpoint

### API Endpoints
```
GET    /health              - Health check
GET    /api/todos           - List all todos
GET    /api/todos/:id       - Get single todo
POST   /api/todos           - Create new todo
PUT    /api/todos/:id       - Update todo
DELETE /api/todos/:id       - Delete todo
```

### Non-Functional Requirements
- Startup in under 3 seconds
- Clear error messages for debugging
- Graceful shutdown handling
- Logging for debugging
- Database connection pooling

## Architecture

### Component Structure
```
backend/src/
├── config/
│   └── database.js       # PostgreSQL connection pool
├── routes/
│   └── todos.js          # Todo routes
├── controllers/
│   └── todos-controller.js  # Business logic
├── models/
│   └── todo-model.js     # Database queries
└── index.js              # Express app setup
```

### Data Flow
```
Client Request
    ↓
Express Router (routes/todos.js)
    ↓
Controller (controllers/todos-controller.js)
    ↓
Model (models/todo-model.js)
    ↓
PostgreSQL Database
    ↓
Response to Client
```

## Related Code Files

### Files to Create
- `backend/src/index.js` - Express server setup
- `backend/src/config/database.js` - Database connection
- `backend/src/routes/todos.js` - Route definitions
- `backend/src/controllers/todos-controller.js` - Request handlers
- `backend/src/models/todo-model.js` - Database operations
- `backend/tests/todos.test.js` - API tests

### Files to Modify
- `backend/README.md` - Add API documentation

## Implementation Steps

### Step 1: Database Configuration (config/database.js)
```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool for PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

module.exports = pool;
```

### Step 2: Todo Model (models/todo-model.js)
```javascript
const pool = require('../config/database');

class TodoModel {
  // Get all todos
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get single todo by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Create new todo
  static async create(title, description) {
    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    return result.rows[0];
  }

  // Update todo
  static async update(id, title, description, completed) {
    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );
    return result.rows[0];
  }

  // Delete todo
  static async delete(id) {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  }
}

module.exports = TodoModel;
```

### Step 3: Todo Controller (controllers/todos-controller.js)
```javascript
const TodoModel = require('../models/todo-model');

class TodoController {
  // GET /api/todos
  static async getAllTodos(req, res) {
    try {
      const todos = await TodoModel.findAll();
      res.json({ success: true, data: todos });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch todos' });
    }
  }

  // GET /api/todos/:id
  static async getTodoById(req, res) {
    try {
      const todo = await TodoModel.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }
      res.json({ success: true, data: todo });
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch todo' });
    }
  }

  // POST /api/todos
  static async createTodo(req, res) {
    try {
      const { title, description } = req.body;

      // Validation
      if (!title) {
        return res.status(400).json({ success: false, error: 'Title is required' });
      }

      const todo = await TodoModel.create(title, description || '');
      res.status(201).json({ success: true, data: todo });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ success: false, error: 'Failed to create todo' });
    }
  }

  // PUT /api/todos/:id
  static async updateTodo(req, res) {
    try {
      const { title, description, completed } = req.body;
      const todo = await TodoModel.update(
        req.params.id,
        title,
        description,
        completed
      );

      if (!todo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      res.json({ success: true, data: todo });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ success: false, error: 'Failed to update todo' });
    }
  }

  // DELETE /api/todos/:id
  static async deleteTodo(req, res) {
    try {
      await TodoModel.delete(req.params.id);
      res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ success: false, error: 'Failed to delete todo' });
    }
  }
}

module.exports = TodoController;
```

### Step 4: Routes Definition (routes/todos.js)
```javascript
const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todos-controller');

// Todo CRUD routes
router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
```

### Step 5: Main Server (index.js)
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/todos', todoRoutes);

// Initialize database schema
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Database schema initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/health`);
    console.log(`  API: http://localhost:${PORT}/api/todos`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});
```

### Step 6: Basic Tests (tests/todos.test.js)
```javascript
const request = require('supertest');
// Tests to be implemented

describe('Todos API', () => {
  test('GET /health returns ok', async () => {
    // Test implementation
  });

  test('GET /api/todos returns array', async () => {
    // Test implementation
  });

  test('POST /api/todos creates todo', async () => {
    // Test implementation
  });
});
```

## Todo List

- [ ] Create database.js configuration
- [ ] Implement TodoModel with all CRUD operations
- [ ] Implement TodoController with error handling
- [ ] Create routes definition
- [ ] Implement main Express server with health check
- [ ] Add database schema initialization
- [ ] Create basic test structure
- [ ] Test all endpoints manually
- [ ] Update backend README with API documentation
- [ ] Verify graceful shutdown works

## Success Criteria

✅ Server starts without errors
✅ Database connection established
✅ All CRUD endpoints functional
✅ Health check returns 200 OK
✅ Error handling returns appropriate status codes
✅ Database schema auto-initializes on first run
✅ Code is well-commented and beginner-friendly
✅ Graceful shutdown on SIGTERM

## Risk Assessment

**Medium Risk**: Database connection issues
- **Issue**: PostgreSQL not running or incorrect credentials
- **Mitigation**: Clear error messages, .env.example with defaults

**Low Risk**: Port already in use
- **Issue**: PORT 3000 occupied
- **Mitigation**: Configurable via environment variable

## Security Considerations

- Parameterized queries prevent SQL injection
- CORS configured for frontend access only
- No sensitive data in logs
- Database credentials in environment variables
- Input validation on POST/PUT requests

## Next Steps

→ Proceed to Phase 03: React Frontend Implementation
- Dependency: Backend API functional
- Frontend will consume these API endpoints

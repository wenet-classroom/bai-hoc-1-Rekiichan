# Phase 03: React Frontend Implementation

**Context Links**: [Plan Overview](plan.md) | [Phase 02](phase-02-backend-api.md)

## Overview

**Date**: 2026-02-09
**Description**: Build React 18 + Vite frontend with simple UI for todos management
**Priority**: P1 (Critical - User interface)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 2h

## Key Insights

- Use functional components and hooks (modern React)
- Keep UI simple and focused on functionality, not aesthetics
- Demonstrate proper API integration patterns
- Include error handling and loading states
- Code should be teaching-friendly with clear comments

## Requirements

### Functional Requirements
- List all todos with status indicators
- Create new todos via form
- Mark todos as complete/incomplete
- Delete todos
- Edit existing todos
- Error messages for failed operations
- Loading states during API calls

### Non-Functional Requirements
- Fast development server startup (< 2s)
- Hot module replacement for development
- Clear component structure
- Responsive layout (mobile-friendly)
- Accessible UI elements

## Architecture

### Component Structure
```
frontend/src/
├── components/
│   ├── TodoList.jsx       # List display
│   ├── TodoItem.jsx       # Individual todo
│   └── TodoForm.jsx       # Create/edit form
├── services/
│   └── api.js             # API client
├── App.jsx                # Root component
├── App.css                # Basic styles
└── main.jsx               # Entry point
```

### Data Flow
```
User Action (Component)
    ↓
API Service (services/api.js)
    ↓
Backend REST API
    ↓
Response → Update Component State
    ↓
UI Re-render
```

## Related Code Files

### Files to Create
- `frontend/src/main.jsx` - Application entry point
- `frontend/src/App.jsx` - Root component with state management
- `frontend/src/App.css` - Basic styling
- `frontend/src/components/TodoList.jsx` - Todo list component
- `frontend/src/components/TodoItem.jsx` - Single todo component
- `frontend/src/components/TodoForm.jsx` - Create/edit form
- `frontend/src/services/api.js` - API client with axios
- `frontend/index.html` - HTML template
- `frontend/vite.config.js` - Vite configuration

### Files to Modify
- `frontend/README.md` - Add component documentation

## Implementation Steps

### Step 1: Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
```

### Step 2: HTML Template (index.html)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevOps Classroom - Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 3: API Service (services/api.js)
```javascript
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods for todos
export const todosAPI = {
  // Get all todos
  getAll: async () => {
    const response = await api.get('/api/todos');
    return response.data.data;
  },

  // Get single todo
  getById: async (id) => {
    const response = await api.get(`/api/todos/${id}`);
    return response.data.data;
  },

  // Create new todo
  create: async (title, description) => {
    const response = await api.post('/api/todos', { title, description });
    return response.data.data;
  },

  // Update todo
  update: async (id, updates) => {
    const response = await api.put(`/api/todos/${id}`, updates);
    return response.data.data;
  },

  // Delete todo
  delete: async (id) => {
    await api.delete(`/api/todos/${id}`);
  },
};

export default api;
```

### Step 4: Todo Form Component (components/TodoForm.jsx)
```jsx
import { useState } from 'react';

export default function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>Add New Todo</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### Step 5: Todo Item Component (components/TodoItem.jsx)
```jsx
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <div className="todo-text">
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
        </div>
      </div>
      <button onClick={() => onDelete(todo.id)} className="delete-btn">
        Delete
      </button>
    </div>
  );
}
```

### Step 6: Todo List Component (components/TodoList.jsx)
```jsx
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos yet. Add one above!</p>;
  }

  return (
    <div className="todo-list">
      <h2>Your Todos ({todos.length})</h2>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

### Step 7: App Component (App.jsx)
```jsx
import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todosAPI } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      setError(null);
      const data = await todosAPI.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTodo({ title, description }) {
    try {
      const newTodo = await todosAPI.create(title, description);
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  }

  async function handleToggleTodo(id) {
    try {
      const todo = todos.find((t) => t.id === id);
      const updated = await todosAPI.update(id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  }

  async function handleDeleteTodo(id) {
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  }

  if (loading) {
    return <div className="container loading">Loading todos...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>📝 DevOps Classroom Todo App</h1>
        <p>A simple full-stack application for learning Docker & CI/CD</p>
      </header>

      {error && <div className="error">{error}</div>}

      <TodoForm onSubmit={handleCreateTodo} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}

export default App;
```

### Step 8: Entry Point (main.jsx)
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 9: Basic Styles (App.css)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #333;
  margin-bottom: 8px;
}

header p {
  color: #666;
  font-size: 14px;
}

.error {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.todo-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 30px;
}

.todo-form h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 12px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.todo-form button {
  background: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.todo-form button:hover {
  background: #0052a3;
}

.todo-list h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed h3 {
  text-decoration: line-through;
}

.todo-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.todo-content input[type="checkbox"] {
  margin-right: 12px;
  cursor: pointer;
}

.todo-text h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.todo-text p {
  font-size: 14px;
  color: #666;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}
```

## Todo List

- [ ] Create vite.config.js
- [ ] Create index.html template
- [ ] Implement API service with axios
- [ ] Create TodoForm component
- [ ] Create TodoItem component
- [ ] Create TodoList component
- [ ] Implement App component with state management
- [ ] Create main.jsx entry point
- [ ] Add basic CSS styling
- [ ] Test all CRUD operations in UI
- [ ] Verify error handling displays correctly
- [ ] Test loading states
- [ ] Update frontend README

## Success Criteria

✅ Development server starts on port 5173
✅ Can create new todos via form
✅ Todos display in list with checkboxes
✅ Can mark todos complete/incomplete
✅ Can delete todos
✅ Error messages display when backend is down
✅ Loading state shows while fetching
✅ UI is responsive and functional
✅ Hot module replacement works

## Risk Assessment

**Medium Risk**: Backend connection issues
- **Issue**: Frontend can't reach backend API
- **Mitigation**: Clear error messages, VITE_API_URL configuration

**Low Risk**: CORS errors
- **Issue**: Browser blocks API calls
- **Mitigation**: Backend already configured with CORS

## Security Considerations

- Environment variables for API URL (no hardcoding)
- Input sanitization via backend validation
- No sensitive data in frontend code
- HTTPS recommended for production

## Next Steps

→ Proceed to Phase 04: Docker Setup & Configurations
- Dependency: Frontend and backend both functional
- Containerize both services

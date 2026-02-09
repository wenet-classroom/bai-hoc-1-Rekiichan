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
        <h1>DevOps Classroom Todo App</h1>
        <p>A simple full-stack application for learning Docker and CI/CD</p>
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

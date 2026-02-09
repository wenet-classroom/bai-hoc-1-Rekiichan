const TodoModel = require('../models/todo-model');

// TodoController handles HTTP request/response for todo endpoints
class TodoController {
  // GET /api/todos - List all todos
  static async getAllTodos(req, res) {
    try {
      const todos = await TodoModel.findAll();
      res.json({ success: true, data: todos });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch todos' });
    }
  }

  // GET /api/todos/:id - Get a single todo
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

  // POST /api/todos - Create a new todo
  static async createTodo(req, res) {
    try {
      const { title, description } = req.body;

      // Validate required field
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

  // PUT /api/todos/:id - Update an existing todo
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

  // DELETE /api/todos/:id - Remove a todo
  static async deleteTodo(req, res) {
    try {
      const deleted = await TodoModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }
      res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ success: false, error: 'Failed to delete todo' });
    }
  }
}

module.exports = TodoController;

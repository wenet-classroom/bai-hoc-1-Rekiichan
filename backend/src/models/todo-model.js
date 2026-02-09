const pool = require('../config/database');

// TodoModel handles all database operations for todos
// Uses plain SQL (no ORM) to teach database fundamentals
class TodoModel {
  // Retrieve all todos, newest first
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Retrieve a single todo by its ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Insert a new todo into the database
  static async create(title, description) {
    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    return result.rows[0];
  }

  // Update an existing todo's fields
  static async update(id, title, description, completed) {
    const result = await pool.query(
      `UPDATE todos
       SET title = $1, description = $2, completed = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, completed, id]
    );
    return result.rows[0];
  }

  // Remove a todo from the database
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = TodoModel;

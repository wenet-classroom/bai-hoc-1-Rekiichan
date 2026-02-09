const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool for PostgreSQL
// A pool manages multiple database connections efficiently
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'classroom_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Log successful connections
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Handle connection errors gracefully
pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

module.exports = pool;

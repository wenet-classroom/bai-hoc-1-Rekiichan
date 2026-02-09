const request = require('supertest');

// Mock the database pool before requiring the app
jest.mock('../src/config/database', () => {
  const mockPool = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return mockPool;
});

const app = require('../src/index');
const pool = require('../src/config/database');

describe('Health Endpoint', () => {
  test('GET /health returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Todos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/todos returns array of todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Test todo', description: '', completed: false },
    ];
    pool.query.mockResolvedValueOnce({ rows: mockTodos });

    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/todos/:id returns single todo', async () => {
    const mockTodo = { id: 1, title: 'Test', description: '', completed: false };
    pool.query.mockResolvedValueOnce({ rows: [mockTodo] });

    const res = await request(app).get('/api/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  test('GET /api/todos/:id returns 404 when not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/todos creates a new todo', async () => {
    const newTodo = { id: 1, title: 'New todo', description: 'Test', completed: false };
    pool.query.mockResolvedValueOnce({ rows: [newTodo] });

    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'New todo', description: 'Test' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('New todo');
  });

  test('POST /api/todos returns 400 without title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ description: 'No title' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('PUT /api/todos/:id updates a todo', async () => {
    const updated = { id: 1, title: 'Updated', description: '', completed: true };
    pool.query.mockResolvedValueOnce({ rows: [updated] });

    const res = await request(app)
      .put('/api/todos/1')
      .send({ title: 'Updated', description: '', completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  test('DELETE /api/todos/:id deletes a todo', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const res = await request(app).delete('/api/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Todo deleted');
  });

  test('DELETE /api/todos/:id returns 404 when not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/todos/999');
    expect(res.statusCode).toBe(404);
  });
});

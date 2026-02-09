import axios from 'axios';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods for todos CRUD operations
export const todosAPI = {
  getAll: async () => {
    const response = await api.get('/api/todos');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/todos/${id}`);
    return response.data.data;
  },

  create: async (title, description) => {
    const response = await api.post('/api/todos', { title, description });
    return response.data.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/api/todos/${id}`, updates);
    return response.data.data;
  },

  delete: async (id) => {
    await api.delete(`/api/todos/${id}`);
  },
};

export default api;

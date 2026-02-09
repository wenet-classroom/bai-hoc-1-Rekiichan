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

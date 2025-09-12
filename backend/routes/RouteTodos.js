// routes/todos.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/todos/:id
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'No encontrado' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos
router.post('/', async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const todo = new Todo({ title, content, date });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/todos/:id  (actualiza todo completo)
router.put('/:id', async (req, res) => {
  try {
    const { title, content, date, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, content, date, completed },
      { new: true, runValidators: true }
    );
    if (!todo) return res.status(404).json({ message: 'No encontrado' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/todos/:id/complete  (toggle completado)
router.patch('/:id/complete', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'No encontrado' });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

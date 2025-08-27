import express from 'express';
import Task from '../models/task.js';
import { authenticate } from '../middleware/auth.js';
import { validateTask } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all task routes
router.use(authenticate);

// POST /tasks - Create a new task
router.post('/', validateTask, Task.create);

// GET /tasks - List all tasks with pagination and filters
router.get('/', Task.findAll);

// GET /tasks/:id - Fetch a specific task
router.get('/:id', Task.findById);

// PUT /tasks/:id - Update task details
router.put('/:id', validateTask, Task.update);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', Task.delete);

export default router;

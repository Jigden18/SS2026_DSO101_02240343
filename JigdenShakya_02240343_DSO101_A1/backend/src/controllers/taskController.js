const prisma = require('../config/db');

const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const where = {};

    if (status === 'active') where.completed = false;
    else if (status === 'completed') where.completed = true;

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      where.priority = priority;
    }

    if (search && search.trim() !== '') {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { created_at: 'desc' }],
    });

    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ success: false, message: `Task with ID ${id} not found.` });

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, due_date, priority } = req.body;
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        due_date: due_date ? new Date(due_date) : null,
        priority: priority || 'medium',
        completed: false,
      },
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: `Task with ID ${id} not found.` });

    const { title, description, due_date, priority, completed } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (completed !== undefined) updateData.completed = Boolean(completed);

    const task = await prisma.task.update({ where: { id }, data: updateData });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: `Task with ID ${id} not found.` });

    await prisma.task.delete({ where: { id } });
    res.json({ success: true, message: `Task ${id} deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
const request = require('supertest');
const app = require('../server');
const prisma = require('../src/config/db');

beforeAll(async () => { await prisma.task.deleteMany(); });
afterAll(async () => { await prisma.task.deleteMany(); await prisma.$disconnect(); });

describe('GET /api/tasks', () => {
  it('returns an array of tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/tasks', () => {
  it('creates a task successfully', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Test Task', description: 'A description', due_date: '2025-12-01', priority: 'high',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Test Task');
    expect(res.body.data.completed).toBe(false);
  });

  it('returns 400 if title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'medium' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'title')).toBe(true);
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns 404 for unknown ID', async () => {
    const res = await request(app).get('/api/tasks/999999');
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('updates a task', async () => {
    const created = await prisma.task.create({ data: { title: 'Old', priority: 'low' } });
    const res = await request(app).put(`/api/tasks/${created.id}`).send({ title: 'Updated', completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated');
    expect(res.body.data.completed).toBe(true);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes a task', async () => {
    const created = await prisma.task.create({ data: { title: 'Delete Me', priority: 'low' } });
    const res = await request(app).delete(`/api/tasks/${created.id}`);
    expect(res.statusCode).toBe(200);
    const check = await prisma.task.findUnique({ where: { id: created.id } });
    expect(check).toBeNull();
  });
});
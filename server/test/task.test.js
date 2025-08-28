const request = require('supertest');
const app = require('../app');

describe('Task Endpoints', () => {
  let authToken;
  let testUserId;
  let testTaskId;

  const testUser = {
    username: 'taskuser',
    email: 'task@example.com',
    password: 'password123'
  };

  const testTask = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending',
    due_date: '2024-12-31'
  };

  // Setup: Register and login user before tests
  beforeAll(async () => {
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    authToken = loginResponse.body.token;
    testUserId = loginResponse.body.user._id;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTask)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.task).toHaveProperty('_id');
      expect(response.body.task.title).toBe(testTask.title);
      expect(response.body.task.description).toBe(testTask.description);
      expect(response.body.task.status).toBe(testTask.status);
      expect(response.body.task.userId).toBe(testUserId);

      // Save task ID for other tests
      testTaskId = response.body.task._id;
    });

    it('should return error for missing title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Task without title',
          status: 'pending'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('Title is required');
    });

    it('should return error for invalid status', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          status: 'invalid_status'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContain('Status must be one of: pending, in_progress, completed, cancelled');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send(testTask)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create a few test tasks
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task 1',
          description: 'First task',
          status: 'pending',
          due_date: '2024-12-31'
        });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task 2',
          description: 'Second task',
          status: 'in_progress',
          due_date: '2024-12-30'
        });
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toBeInstanceOf(Array);
      expect(response.body.tasks.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks.every(task => task.status === 'pending')).toBe(true);
    });

    it('should filter tasks by search term', async () => {
      const response = await request(app)
        .get('/api/tasks?search=Task 1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks.some(task => task.title.includes('Task 1'))).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a specific task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.task).toHaveProperty('_id', testTaskId);
      expect(response.body.task.title).toBe(testTask.title);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task Title',
        status: 'in_progress'
      };

      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.task.title).toBe(updateData.title);
      expect(response.body.task.status).toBe(updateData.status);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return error for invalid status', async () => {
      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send({ title: 'Updated Title' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(response.body.task).toHaveProperty('_id', testTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/tasks/route';
import { GETById, PUTById, DELETEById } from '@/app/api/tasks/[id]/route';

// Mock all dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma');
vi.mock('@/lib/rate-limit');

describe('Tasks API Routes', () => {
  const mockSession = {
    user: {
      email: 'test@test.com',
      id: 'test-id',
      name: 'Test User',
    },
  };

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    userId: 'test-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
  });

  describe('POST /api/tasks', () => {
    const mockRequest = (body: any) => {
      return {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      } as NextRequest;
    };

    it('should create a new task', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'New Task',
        description: 'Test description',
        status: 'todo',
        projectId: 'project-1',
        userId: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.project.findFirst as vi.Mock).mockResolvedValue(mockProject);
      (prisma.task.create as vi.Mock).mockResolvedValue(mockTask);

      const request = mockRequest({
        title: 'New Task',
        description: 'Test description',
        projectId: 'project-1',
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.title).toBe('New Task');
    });

    it('should return 400 for invalid input', async () => {
      const request = mockRequest({
        title: '',
        projectId: 'project-1',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 401 for unauthenticated user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        title: 'New Task',
        projectId: 'project-1',
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when project not found', async () => {
      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.project.findFirst as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        title: 'New Task',
        projectId: 'project-1',
      });

      const response = await POST(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Project not found or access denied');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      (checkRateLimit as vi.Mock).mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = mockRequest({
        title: 'New Task',
        projectId: 'project-1',
      });

      const response = await POST(request);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });
  });

  describe('PUT /api/tasks/[id]', () => {
    const mockRequest = (body: any) => {
      return {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      } as NextRequest;
    };

    it('should update a task', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in_progress',
        projectId: 'project-1',
        userId: 'test-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.task.findFirst as vi.Mock).mockResolvedValue(mockTask);
      (prisma.task.update as vi.Mock).mockResolvedValue(mockTask);

      const request = mockRequest({
        status: 'in_progress',
      });

      const response = await PUTById(request, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('in_progress');
    });

    it('should return 401 for unauthenticated user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        status: 'in_progress',
      });

      const response = await PUTById(request, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when task not found', async () => {
      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.task.findFirst as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        status: 'in_progress',
      });

      const response = await PUTById(request, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Task not found');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      (checkRateLimit as vi.Mock).mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = mockRequest({
        status: 'in_progress',
      });

      const response = await PUTById(request, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });
  });

  describe('DELETE /api/tasks/[id]', () => {
    const mockRequest = new NextRequest('http://localhost/api/tasks/task-1', {
      method: 'DELETE',
    });

    it('should delete a task', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Task to delete',
        projectId: 'project-1',
        userId: 'test-id',
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.task.findFirst as vi.Mock).mockResolvedValue(mockTask);
      (prisma.task.delete as vi.Mock).mockResolvedValue(mockTask);

      const response = await DELETEById(mockRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Task deleted');
    });

    it('should return 401 for unauthenticated user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);

      const response = await DELETEById(mockRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when task not found', async () => {
      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.task.findFirst as vi.Mock).mockResolvedValue(null);

      const response = await DELETEById(mockRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Task not found');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      (checkRateLimit as vi.Mock).mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const response = await DELETEById(mockRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });
  });
});

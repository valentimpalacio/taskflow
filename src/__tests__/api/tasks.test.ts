import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { POST } from '@/app/api/tasks/route';
import { PUT as PUTById, DELETE as DELETEById } from '@/app/api/tasks/[id]/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    project: {
      findFirst: vi.fn(),
    },
    task: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 99,
    resetTime: Date.now() + 60000,
  }),
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

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

describe('Tasks API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue(mockSession);
    const { checkRateLimit } = require('@/lib/rate-limit');
    checkRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 99,
      resetTime: Date.now() + 60000,
    });
  });

  describe('POST /api/tasks', () => {
    const mockRequest = (body: Record<string, unknown>) => {
      return new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
      });
    };

    it('should create a new task', async () => {
      const { prisma } = require('@/lib/prisma');
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

      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.project.findFirst.mockResolvedValue(mockProject);
      prisma.task.create.mockResolvedValue(mockTask);

      const request = mockRequest({
        title: 'New Task',
        description: 'Test description',
        projectId: 'project-1',
      });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.title).toBe('New Task');
    });

    it('should return 400 for invalid input', async () => {
      const request = mockRequest({ title: '', projectId: 'project-1' });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const request = mockRequest({
        title: 'New Task',
        projectId: 'project-1',
      });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(401);
    });

    it('should return 404 when project not found', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.project.findFirst.mockResolvedValue(null);

      const request = mockRequest({
        title: 'New Task',
        projectId: 'project-1',
      });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Project not found or access denied');
    });
  });

  describe('PUT /api/tasks/[id]', () => {
    const mockRequest = (body: Record<string, unknown>) => {
      return new Request('http://localhost/api/tasks/task-1', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
      });
    };

    it('should update a task', async () => {
      const { prisma } = require('@/lib/prisma');
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

      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.task.findFirst.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue(mockTask);

      const request = mockRequest({ status: 'in_progress' });

      const response = await PUTById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('in_progress');
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const request = mockRequest({ status: 'in_progress' });

      const response = await PUTById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 when task not found', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.task.findFirst.mockResolvedValue(null);

      const request = mockRequest({ status: 'in_progress' });

      const response = await PUTById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/[id]', () => {
    it('should delete a task', async () => {
      const { prisma } = require('@/lib/prisma');
      const mockTask = {
        id: 'task-1',
        title: 'Task to delete',
        projectId: 'project-1',
        userId: 'test-id',
      };

      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.task.findFirst.mockResolvedValue(mockTask);
      prisma.task.delete.mockResolvedValue(mockTask);

      const request = new Request('http://localhost/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETEById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Task deleted');
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const request = new Request('http://localhost/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETEById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 when task not found', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.task.findFirst.mockResolvedValue(null);

      const request = new Request('http://localhost/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETEById(request as unknown as import('next/server').NextRequest, {
        params: Promise.resolve({ id: 'task-1' }),
      });

      expect(response.status).toBe(404);
    });
  });
});

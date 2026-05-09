import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { GET, POST } from '@/app/api/projects/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    project: {
      create: vi.fn(),
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

describe('Projects API Routes', () => {
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

  describe('GET /api/projects', () => {
    it('should return projects for authenticated user', async () => {
      const { prisma } = require('@/lib/prisma');
      const mockProjects = [
        {
          id: 'project-1',
          name: 'Project 1',
          description: 'Description 1',
          userId: 'test-id',
          createdAt: new Date().toISOString(),
          tasks: [],
        },
      ];

      prisma.user.findUnique.mockResolvedValue({
        ...mockSession.user,
        projects: mockProjects,
      });

      const request = new Request('http://localhost/api/projects');
      const response = await GET(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.projects).toHaveLength(1);
      expect(data.projects[0].name).toBe('Project 1');
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const request = new Request('http://localhost/api/projects');
      const response = await GET(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = require('@/lib/rate-limit');
      checkRateLimit.mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = new Request('http://localhost/api/projects');
      const response = await GET(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });

    it('should return 404 when user not found', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);

      const request = new Request('http://localhost/api/projects');
      const response = await GET(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('User not found');
    });
  });

  describe('POST /api/projects', () => {
    const mockRequest = (body: Record<string, unknown>) => {
      return new Request('http://localhost/api/projects', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
      });
    };

    it('should create a new project', async () => {
      const { prisma } = require('@/lib/prisma');
      const mockProject = {
        id: 'project-1',
        name: 'New Project',
        description: 'Test description',
        userId: 'test-id',
        createdAt: new Date().toISOString(),
      };

      prisma.user.findUnique.mockResolvedValue(mockSession.user);
      prisma.project.create.mockResolvedValue(mockProject);

      const request = mockRequest({
        name: 'New Project',
        description: 'Test description',
      });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.name).toBe('New Project');
    });

    it('should return 400 for invalid input', async () => {
      const request = mockRequest({ name: '' });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth');
      getServerSession.mockResolvedValue(null);

      const request = mockRequest({ name: 'New Project' });

      const response = await POST(request as unknown as import('next/server').NextRequest);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});

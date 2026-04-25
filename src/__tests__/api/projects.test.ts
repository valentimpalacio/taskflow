import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/projects/route';

// Mock all dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma');
vi.mock('@/lib/rate-limit');

describe('Projects API Routes', () => {
  const mockSession = {
    user: {
      email: 'test@test.com',
      id: 'test-id',
      name: 'Test User',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as vi.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/projects', () => {
    it('should return projects for authenticated user', async () => {
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

      (prisma.user.findUnique as vi.Mock).mockResolvedValue({
        ...mockSession.user,
        projects: mockProjects,
      });

      const request = new NextRequest('http://localhost/api/projects');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.projects).toHaveLength(1);
      expect(data.projects[0].name).toBe('Project 1');
    });

    it('should return 401 for unauthenticated user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      (checkRateLimit as vi.Mock).mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = new NextRequest('http://localhost/api/projects');
      const response = await GET(request);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });

    it('should return 404 when user not found', async () => {
      (prisma.user.findUnique as vi.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects');
      const response = await GET(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('User not found');
    });
  });

  describe('POST /api/projects', () => {
    const mockRequest = (body: any) => {
      return {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      } as NextRequest;
    };

    it('should create a new project', async () => {
      const mockProject = {
        id: 'project-1',
        name: 'New Project',
        description: 'Test description',
        userId: 'test-id',
        createdAt: new Date().toISOString(),
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockSession.user);
      (prisma.project.create as vi.Mock).mockResolvedValue(mockProject);

      const request = mockRequest({
        name: 'New Project',
        description: 'Test description',
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.name).toBe('New Project');
    });

    it('should return 400 for invalid input', async () => {
      const request = mockRequest({
        name: '',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 401 for unauthenticated user', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        name: 'New Project',
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      (checkRateLimit as vi.Mock).mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = mockRequest({
        name: 'New Project',
      });

      const response = await POST(request);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });

    it('should return 404 when user not found', async () => {
      (prisma.user.findUnique as vi.Mock).mockResolvedValue(null);

      const request = mockRequest({
        name: 'New Project',
      });

      const response = await POST(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('User not found');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { POST } from '@/app/api/auth/signup/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 4,
    resetTime: Date.now() + 900000,
  }),
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

const mockRequest = (body: Record<string, unknown>) => {
  return new Request('http://localhost/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
};

describe('Auth API Routes', () => {
  describe('POST /api/auth/signup', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      const { checkRateLimit } = require('@/lib/rate-limit');
      checkRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 900000,
      });
    });

    it('should create a new user with valid data', async () => {
      const { prisma } = require('@/lib/prisma');
      const mockUser = {
        id: 'test-id',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashed-password',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
        name: 'Test User',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('User created successfully');
      expect(data.userId).toBe('test-id');
    });

    it('should return 400 for invalid email', async () => {
      const request = mockRequest({
        email: 'invalid',
        password: 'Strong@123',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    it('should return 400 for weak password', async () => {
      const request = mockRequest({
        email: 'test@test.com',
        password: 'weak',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Password must be at least');
    });

    it('should return 409 for existing user', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: 'existing@test.com',
      });

      const request = mockRequest({
        email: 'existing@test.com',
        password: 'Strong@123',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });

    it('should return 429 when rate limit exceeded', async () => {
      const { checkRateLimit } = require('@/lib/rate-limit');
      checkRateLimit.mockResolvedValue({
        allowed: false,
        retryAfter: 30,
      });

      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });

    it('should return 500 for server errors', async () => {
      const { prisma } = require('@/lib/prisma');
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
      });

      const response = await POST(request as unknown as Request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });
  });
});

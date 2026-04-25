import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/signup/route';

// Mock all dependencies
vi.mock('@/lib/prisma');
vi.mock('@/lib/rate-limit');

describe('Auth API Routes', () => {
  describe('POST /api/auth/signup', () => {
    const mockRequest = (body: any) => {
      return {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      } as NextRequest;
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should create a new user with valid data', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashed-password',
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(null);
      (prisma.user.create as vi.Mock).mockResolvedValue(mockUser);

      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
        name: 'Test User',
      });

      const response = await POST(request);

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

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    it('should return 400 for weak password', async () => {
      const request = mockRequest({
        email: 'test@test.com',
        password: 'weak',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Password must be at least');
    });

    it('should return 409 for existing user', async () => {
      const mockUser = {
        id: 'existing-id',
        email: 'existing@test.com',
        name: 'Existing User',
        password: 'hashed-password',
      };

      (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);

      const request = mockRequest({
        email: 'existing@test.com',
        password: 'Strong@123',
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });

    it('should return 429 when rate limit exceeded', async () => {
      // Mock rate limit check to return not allowed
      vi.mock('@/lib/rate-limit', () => ({
        checkRateLimit: vi.fn().mockResolvedValue({
          allowed: false,
          retryAfter: 30,
        }),
      }));

      const { POST: POSTWithRateLimit } = await import('@/app/api/auth/signup/route');
      
      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
      });

      const response = await POSTWithRateLimit(request);

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Too many requests');
    });

    it('should return 500 for server errors', async () => {
      (prisma.user.findUnique as vi.Mock).mockRejectedValue(new Error('Database error'));

      const request = mockRequest({
        email: 'test@test.com',
        password: 'Strong@123',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });
  });
});

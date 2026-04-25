import {
  validateSignup,
  validateProjectInput,
  validateTaskInput,
  validateTaskUpdate,
} from '@/lib/validators';

describe('Validators', () => {
  describe('validateSignup', () => {
    it('should pass with valid data', () => {
      const result = validateSignup({
        email: 'test@test.com',
        password: 'Strong@123',
      });
      expect(result.valid).toBe(true);
      expect(result.data?.email).toBe('test@test.com');
    });

    it('should pass with name included', () => {
      const result = validateSignup({
        email: 'test@test.com',
        password: 'Strong@123',
        name: 'John',
      });
      expect(result.valid).toBe(true);
      expect(result.data?.name).toBe('John');
    });

    it('should fail with missing email', () => {
      const result = validateSignup({ password: 'Strong@123' } as any);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid input: expected string, received undefined');
    });

    it('should fail with invalid email', () => {
      const result = validateSignup({ email: 'invalid', password: 'Strong@123' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should fail with short password', () => {
      const result = validateSignup({ email: 'test@test.com', password: 'Short1!' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should fail with password missing uppercase', () => {
      const result = validateSignup({ email: 'test@test.com', password: 'strong@123' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain at least one uppercase letter');
    });

    it('should fail with password missing number', () => {
      const result = validateSignup({ email: 'test@test.com', password: 'Strong@abc' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain at least one number');
    });

    it('should fail with password missing special character', () => {
      const result = validateSignup({ email: 'test@test.com', password: 'Strong1234' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must contain at least one special character');
    });

    it('should fail with missing password', () => {
      const result = validateSignup({ email: 'test@test.com' } as any);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid input: expected string, received undefined');
    });
  });

  describe('validateProjectInput', () => {
    it('should pass with valid name', () => {
      const result = validateProjectInput({ name: 'My Project' });
      expect(result.valid).toBe(true);
      expect(result.data?.name).toBe('My Project');
    });

    it('should pass with description', () => {
      const result = validateProjectInput({ name: 'P', description: 'A project' });
      expect(result.valid).toBe(true);
      expect(result.data?.description).toBe('A project');
    });

    it('should fail with empty name', () => {
      const result = validateProjectInput({ name: '' });
      expect(result.valid).toBe(false);
    });

    it('should trim whitespace from name', () => {
      const result = validateProjectInput({ name: '  Project  ' });
      expect(result.data?.name).toBe('Project');
    });

    it('should fail with name too long', () => {
      const result = validateProjectInput({ name: 'a'.repeat(101) });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Project name must be under 100 characters');
    });
  });

  describe('validateTaskInput', () => {
    it('should pass with valid data', () => {
      const result = validateTaskInput({ title: 'Task', projectId: '123' });
      expect(result.valid).toBe(true);
    });

    it('should fail without title', () => {
      const result = validateTaskInput({ projectId: '123' });
      expect(result.valid).toBe(false);
    });

    it('should fail without projectId', () => {
      const result = validateTaskInput({ title: 'Task' });
      expect(result.valid).toBe(false);
    });
  });

  describe('validateTaskUpdate', () => {
    it('should pass with valid status', () => {
      const result = validateTaskUpdate({ status: 'done' });
      expect(result.valid).toBe(true);
      expect(result.data?.status).toBe('done');
    });

    it('should fail with invalid status', () => {
      const result = validateTaskUpdate({ status: 'invalid' });
      expect(result.valid).toBe(false);
    });

    it('should pass with empty update', () => {
      const result = validateTaskUpdate({});
      expect(result.valid).toBe(true);
    });
  });
});

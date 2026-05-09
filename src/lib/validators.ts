import { z } from 'zod';

const emailSchema = z.string().min(1, 'Email is required').email('Invalid email format');

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().optional(),
});

const projectInputSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name must be under 100 characters'),
  description: z.string().optional(),
});

const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().trim().min(1, 'Project ID is required'),
});

const taskUpdateSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  description: z.string().optional(),
  title: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export function validateEmail(email: string): string | null {
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.issues[0].message;
}

export function validatePassword(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  return result.success ? null : result.error.issues[0].message;
}

export function validateSignup(data: unknown): { valid: boolean; error?: string; data?: SignupInput } {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return { valid: false, error: result.error.issues[0].message };
  }
  return { valid: true, data: result.data };
}

export function validateProjectInput(data: unknown): { valid: boolean; error?: string; data?: ProjectInput } {
  const result = projectInputSchema.safeParse(data);
  if (!result.success) {
    return { valid: false, error: result.error.issues[0].message };
  }
  return { valid: true, data: result.data };
}

export function validateTaskInput(data: unknown): { valid: boolean; error?: string; data?: TaskInput } {
  const result = taskInputSchema.safeParse(data);
  if (!result.success) {
    return { valid: false, error: result.error.issues[0].message };
  }
  return { valid: true, data: result.data };
}

export function validateTaskUpdate(data: unknown): { valid: boolean; error?: string; data?: TaskUpdateInput } {
  const result = taskUpdateSchema.safeParse(data);
  if (!result.success) {
    return { valid: false, error: result.error.issues[0].message };
  }
  return { valid: true, data: result.data };
}

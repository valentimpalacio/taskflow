import { useMutation, useQuery } from '@tanstack/react-query';
import { Task, Project } from '@/types';

interface DuplicateTaskPayload {
  taskId: string;
  title: string;
  description?: string;
  count: number;
  makeTemplate: boolean;
  templateName?: string;
}

interface DuplicateProjectPayload {
  projectId: string;
  name: string;
  description?: string;
  count: number;
  makeTemplate: boolean;
  templateName?: string;
}

export function useDuplicateTask() {
  return useMutation({
    mutationFn: async (payload: DuplicateTaskPayload) => {
      const response = await fetch('/api/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to duplicate task');
      return response.json();
    },
  });
}

export function useDuplicateProject() {
  return useMutation({
    mutationFn: async (payload: DuplicateProjectPayload) => {
      const response = await fetch('/api/duplicate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to duplicate project');
      return response.json();
    },
  });
}

export function useProjectTemplates() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: async () => {
      const response = await fetch('/api/projects/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json() as Promise<Project[]>;
    },
  });
}

export function useCreateFromTemplate() {
  return useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch('/api/projects/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      if (!response.ok) throw new Error('Failed to create from template');
      return response.json();
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Task, TaskStatus } from '@/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      return data.projects as Project[];
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update task status');
      return res.json();
    },
    // Implementação do Update Otimista
    onMutate: async ({ taskId, status }) => {
      // Cancela refetches em andamento para não sobrescrever o update otimista
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot do estado anterior
      const previousProjects = queryClient.getQueryData<Project[]>(['projects']);

      // Atualiza o cache local instantaneamente
      queryClient.setQueryData<Project[]>(['projects'], (old) => {
        if (!old) return [];
        return old.map((project) => ({
          ...project,
          tasks: (project.tasks || []).map((task) =>
            task.id === taskId ? { ...task, status } : task
          ),
        }));
      });

      return { previousProjects };
    },
    // Se a mutação falhar, reverte para o estado anterior
    onError: (err, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    // Sempre refetch após erro ou sucesso para garantir sincronia com o servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

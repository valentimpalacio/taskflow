import { describe, it, expect, vi } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import StatsCards from '@/components/dashboard/StatsCards';
import { Project } from '@/types';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      stats: {
        totalProjects: 'Total Projects',
        totalTasks: 'Total Tasks',
        completedTasks: 'Completed Tasks',
        inProgressTasks: 'In Progress Tasks',
        complete: 'complete',
      },
    };
    return translations[namespace]?.[key] || `${namespace}.${key}`;
  },
}));

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Test project',
    createdAt: '2024-01-01',
    tasks: [
      { id: 't1', title: 'Task 1', status: 'todo', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 't2', title: 'Task 2', status: 'in_progress', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 't3', title: 'Task 3', status: 'done', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ],
  },
  {
    id: '2',
    name: 'Project 2',
    createdAt: '2024-01-01',
    tasks: [],
  },
];

describe('StatsCards', () => {
  it('renders all four stat cards', () => {
    render(<StatsCards projects={mockProjects} />);
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('In Progress Tasks')).toBeInTheDocument();
  });

  it('displays correct project count', () => {
    render(<StatsCards projects={mockProjects} />);
    const projectValues = screen.getAllByText('2');
    expect(projectValues.length).toBeGreaterThanOrEqual(1);
  });

  it('displays correct task count', () => {
    render(<StatsCards projects={mockProjects} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows completion percentage when tasks exist', () => {
    render(<StatsCards projects={mockProjects} />);
    expect(screen.getByText('33% complete')).toBeInTheDocument();
  });

  it('handles empty projects array', () => {
    render(<StatsCards projects={[]} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });
});

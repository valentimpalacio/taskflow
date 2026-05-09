import { describe, it, expect, vi } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import AllTasks from '@/components/dashboard/AllTasks';
import { Project } from '@/types';

const mockShowToast = vi.fn();
vi.mock('@/components/dashboard/Toast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      dashboard: {
        todo: 'To Do',
        inProgress: 'In Progress',
        done: 'Done',
        allStatus: 'All Status',
        noTasksFound: 'No tasks found',
        confirmDelete: 'Are you sure?',
        taskDeleted: 'Task deleted',
        failedDeleteTask: 'Failed to delete',
        failedUpdateTask: 'Failed to update',
        error: 'Error',
        editTask: 'Edit Task',
      },
      common: {
        searchTasks: 'Search tasks...',
        exportCSV: 'Export CSV',
      },
    };
    return translations[namespace]?.[key] || `${namespace}.${key}`;
  },
}));

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    createdAt: '2024-01-01',
    tasks: [
      { id: 't1', title: 'Todo Task', status: 'todo', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 't2', title: 'In Progress Task', status: 'in_progress', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 't3', title: 'Done Task', status: 'done', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ],
  },
];

const emptyProjects: Project[] = [];

describe('AllTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<AllTasks projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    render(<AllTasks projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(<AllTasks projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('Todo Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('renders CSV export button', () => {
    render(<AllTasks projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('CSV')).toBeInTheDocument();
  });

  it('shows no tasks found when empty', () => {
    render(<AllTasks projects={emptyProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('renders project name badges on task cards', () => {
    render(<AllTasks projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });
});

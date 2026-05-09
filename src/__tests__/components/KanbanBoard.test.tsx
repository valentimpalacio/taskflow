import { describe, it, expect, vi } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
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
        dropTasksHere: 'Drop tasks here',
        failedMoveTask: 'Failed to move task',
        error: 'Error',
        editTask: 'Edit Task',
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
      { id: 't2', title: 'In Progress Task', description: 'Working on it', status: 'in_progress', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 't3', title: 'Done Task', status: 'done', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ],
  },
];

const emptyProjects: Project[] = [
  {
    id: '1',
    name: 'Empty Project',
    createdAt: '2024-01-01',
    tasks: [],
  },
];

describe('KanbanBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders three columns', () => {
    render(<KanbanBoard projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders tasks in correct columns', () => {
    render(<KanbanBoard projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('Todo Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('renders task descriptions', () => {
    render(<KanbanBoard projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('Working on it')).toBeInTheDocument();
  });

  it('renders project name on task cards', () => {
    render(<KanbanBoard projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });

  it('shows drop placeholder for empty columns', () => {
    render(<KanbanBoard projects={emptyProjects} onRefresh={vi.fn()} />);
    const placeholders = screen.getAllByText('Drop tasks here');
    expect(placeholders.length).toBe(3);
  });

  it('displays task count badges', () => {
    render(<KanbanBoard projects={mockProjects} onRefresh={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

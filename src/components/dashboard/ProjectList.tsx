'use client';

import { Project, TaskStatus } from '@/types';
import { useToast } from './Toast';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/types';

export default function ProjectList({
  projects,
  onRefresh,
}: {
  projects: Project[];
  onRefresh: () => void;
}) {
  const { showToast } = useToast();

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Project deleted', 'success');
        onRefresh();
      } else showToast('Failed to delete project', 'error');
    } catch {
      showToast('Network error', 'error');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onRefresh();
      else showToast('Failed to update task', 'error');
    } catch {
      showToast('Network error', 'error');
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <p className="text-slate-500 dark:text-slate-400">
          No projects yet. Create your first project!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {project.description}
                </p>
              )}
            </div>
            <button
              onClick={() => deleteProject(project.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
            </span>
            {project.tasks.some((t) => t.status === 'done') && (
              <span className="text-emerald-500">
                {project.tasks.filter((t) => t.status === 'done').length} done
              </span>
            )}
          </div>
          {project.tasks.length > 0 ? (
            <div className="space-y-2">
              {project.tasks.slice(0, 4).map((task) => {
                const taskColors =
                  TASK_STATUS_COLORS[task.status as TaskStatus];
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${taskColors.bg}`}
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                        {task.title}
                      </span>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value)
                      }
                      className="text-xs border-0 bg-transparent text-slate-500 dark:text-slate-400 cursor-pointer focus:ring-0 p-0"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                );
              })}
              {project.tasks.length > 4 && (
                <p className="text-xs text-slate-400 pl-4">
                  +{project.tasks.length - 4} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-2">
              No tasks yet
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

'use client';

import { Project, TaskStatus, TASK_STATUS_COLORS } from '@/types';
import { useTranslations } from 'next-intl';
import { useToast } from './Toast';
import { useState } from 'react';
import ProjectEditModal from './ProjectEditModal';
import { Pencil, Trash2, FolderKanban } from 'lucide-react';

interface Props {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectList({ projects, onRefresh }: Props) {
  const t = useTranslations('dashboard');
  const { showToast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const deleteProject = async (id: string) => {
    if (!confirm(t('confirmDeleteProject'))) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('projectDeleted'), 'success');
        onRefresh();
      } else showToast(t('failedDeleteProject'), 'error');
    } catch {
      showToast(t('error'), 'error');
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
      else showToast(t('failedUpdateTask'), 'error');
    } catch {
      showToast(t('error'), 'error');
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderKanban className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {t('noProjects')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, idx) => {
          const tasks = project.tasks || [];
          const doneCount = tasks.filter((t) => t.status === 'done').length;
          const progress = tasks.length > 0
            ? Math.round((doneCount / tasks.length) * 100)
            : 0;

          return (
            <div
              key={project.id}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 card-hover shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${(idx % 6) * 0.05}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {tasks.length} {tasks.length !== 1 ? t('tasks') : t('task')}
                </span>
                {doneCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {doneCount} {t('done').toLowerCase()}
                  </span>
                )}
                {tasks.length > 0 && (
                  <span className="ml-auto font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                    {progress}%
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {tasks.length > 0 && (
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Tasks */}
              {tasks.length > 0 ? (
                <div className="space-y-1.5">
                  {tasks.slice(0, 4).map((task) => {
                    const taskColors = TASK_STATUS_COLORS[task.status as TaskStatus];
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${taskColors.dot}`} />
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                            {task.title}
                          </span>
                        </div>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="text-xs border-0 bg-transparent text-slate-500 dark:text-slate-400 cursor-pointer focus:ring-0 p-0 ml-2 font-medium"
                        >
                          <option value="todo">{t('todo')}</option>
                          <option value="in_progress">{t('inProgress')}</option>
                          <option value="done">{t('done')}</option>
                        </select>
                      </div>
                    );
                  })}
                  {tasks.length > 4 && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 pl-3 pt-1">
                      +{tasks.length - 4} {t('more')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 py-3 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  {t('noTasks')}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {editingProject && (
        <ProjectEditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
}
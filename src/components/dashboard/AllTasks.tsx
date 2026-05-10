'use client';

import { useState, useMemo } from 'react';
import {
  Project,
  Task,
  TaskStatus,
  TASK_STATUS_COLORS,
} from '@/types';
import { useTranslations } from 'next-intl';
import { useToast } from './Toast';
import TaskEditModal from './TaskEditModal';
import { Search, Download, Trash2, ChevronDown, Filter } from 'lucide-react';

interface Props {
  projects: Project[];
  onRefresh: () => void;
}

export default function AllTasks({ projects, onRefresh }: Props) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { showToast } = useToast();

  const statusLabels: Record<TaskStatus, string> = {
    todo: t('todo'),
    in_progress: t('inProgress'),
    done: t('done'),
  };

  const allTasks = projects.flatMap((p) =>
    (p.tasks || []).map((t) => ({ ...t, projectName: p.name, projectId: p.id }))
  );

  const filtered = useMemo(() => {
    return allTasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        false;
      const matchFilter = filter === 'all' || t.status === filter;
      return matchSearch && matchFilter;
    });
  }, [allTasks, search, filter]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onRefresh();
    } catch {
      showToast(t('error'), 'error');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('taskDeleted'), 'success');
        onRefresh();
      } else showToast(t('failedDeleteTask'), 'error');
    } catch {
      showToast(t('error'), 'error');
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Description', 'Status', 'Project', 'Created'];
    const rows = filtered.map((t) => [
      t.title,
      t.description || '',
      statusLabels[t.status as TaskStatus],
      t.projectName,
      new Date(t.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(tCommon('exportCSV'), 'success');
  };

  return (
    <>
      <div>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={tCommon('searchTasks')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none cursor-pointer"
              >
                <option value="all">{t('allStatus')}</option>
                <option value="todo">{t('todo')}</option>
                <option value="in_progress">{t('inProgress')}</option>
                <option value="done">{t('done')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 font-medium text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t('noTasksFound')}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filtered.map((task, idx) => {
              const colors = TASK_STATUS_COLORS[task.status as TaskStatus];
              return (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 card-hover shadow-sm group animate-fade-in-up"
                  style={{ animationDelay: `${(idx % 9) * 0.03}s` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-md">
                      {task.projectName}
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1 border-0 cursor-pointer focus:ring-0 transition-all ${colors.bg} ${colors.text}`}
                    >
                      <option value="todo">{t('todo')}</option>
                      <option value="in_progress">{t('inProgress')}</option>
                      <option value="done">{t('done')}</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          projects={projects}
          onClose={() => setEditingTask(null)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
}
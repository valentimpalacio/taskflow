'use client';

import { useState, useCallback } from 'react';
import { Project, Task, TaskStatus } from '@/types';
import { useTranslations } from 'next-intl';
import { useToast } from './Toast';
import TaskEditModal from './TaskEditModal';
import { useUpdateTaskStatus } from '@/lib/hooks/useProjects';
import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';

interface Props {
  projects: Project[];
  onRefresh: () => void;
}

const columns: TaskStatus[] = ['todo', 'in_progress', 'done'];

export default function KanbanBoard({ projects, onRefresh }: Props) {
  const t = useTranslations('dashboard');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { showToast } = useToast();
  const updateTaskMutation = useUpdateTaskStatus();

  const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectName: p.name, projectId: p.id })));

  const getTasksByStatus = useCallback((status: TaskStatus) => allTasks.filter(t => t.status === status), [allTasks]);

  const statusMeta: Record<TaskStatus, { label: string; color: string; border: string; accent: string; dot: string }> = {
    todo: {
      label: t('todo'),
      color: 'from-slate-400 to-slate-500',
      border: 'border-t-slate-400',
      accent: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
    },
    in_progress: {
      label: t('inProgress'),
      color: 'from-amber-400 to-amber-500',
      border: 'border-t-amber-400',
      accent: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-400',
    },
    done: {
      label: t('done'),
      color: 'from-emerald-400 to-emerald-500',
      border: 'border-t-emerald-400',
      accent: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-400',
    },
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({ taskId, status });
    } catch {
      showToast(t('failedMoveTask'), 'error');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-400">
        {columns.map(status => {
          const meta = statusMeta[status];
          const tasks = getTasksByStatus(status);
          return (
            <div
              key={status}
              className={`bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/50 border-t-4 ${meta.border} ${dragOverCol === status ? 'drag-over' : ''} shadow-sm`}
              onDragOver={e => { e.preventDefault(); setDragOverCol(status); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={e => {
                e.preventDefault();
                setDragOverCol(null);
                if (draggedTask && draggedTask.status !== status) {
                  updateTaskStatus(draggedTask.id, status);
                }
              }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${meta.dot} shadow-sm`} />
                  <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                    {meta.label}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full tabular-nums">
                    {tasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="px-3 pb-3 space-y-2.5 min-h-[120px]">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTask(task)}
                    onDragEnd={() => { setDraggedTask(null); setDragOverCol(null); }}
                    onClick={() => setEditingTask(task)}
                    className={`relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing card-hover group ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                  >
                    {/* Drag indicator */}
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-slate-200 dark:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <span className="inline-block text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md mt-2.5">
                          {task.projectName}
                        </span>
                      </div>
                    </div>

                    {/* Status indicator strip at bottom */}
                    <div className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r ${meta.color} opacity-0 group-hover:opacity-60 transition-opacity`} />
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-sm text-slate-400 dark:text-slate-500 gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span>{t('dropTasksHere')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
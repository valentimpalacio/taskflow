'use client';

import { useState, useCallback } from 'react';
import { Project, Task, TaskStatus, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/types';
import { useToast } from './Toast';

interface Props {
  projects: Project[];
  onRefresh: () => void;
}

const columns: TaskStatus[] = ['todo', 'in_progress', 'done'];

export default function KanbanBoard({ projects, onRefresh }: Props) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const { showToast } = useToast();

  const allTasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, projectName: p.name })));

  const getTasksByStatus = useCallback((status: TaskStatus) => allTasks.filter(t => t.status === status), [allTasks]);

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onRefresh();
      else showToast('Failed to move task', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const columnStyles: Record<TaskStatus, { header: string; border: string }> = {
    todo: { header: 'bg-slate-500', border: 'border-t-slate-500' },
    in_progress: { header: 'bg-amber-500', border: 'border-t-amber-500' },
    done: { header: 'bg-emerald-500', border: 'border-t-emerald-500' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-400">
      {columns.map(status => {
        const tasks = getTasksByStatus(status);
        return (
          <div
            key={status}
            className={`bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-3 border-t-4 ${columnStyles[status].border} ${dragOverCol === status ? 'drag-over' : ''}`}
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
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${columnStyles[status].header}`} />
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">{TASK_STATUS_LABELS[status]}</h3>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTask(task)}
                  onDragEnd={() => { setDraggedTask(null); setDragOverCol(null); }}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                  {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{task.projectName}</p>
                </div>
              ))}
              {tasks.length === 0 && <div className="text-center py-8 text-sm text-slate-400">Drop tasks here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

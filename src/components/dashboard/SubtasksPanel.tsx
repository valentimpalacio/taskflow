'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Subtask } from '@/types';

interface SubtasksPanelProps {
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onDeleteSubtask: (id: string) => void;
}

export default function SubtasksPanel({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: SubtasksPanelProps) {
  const [newSubtask, setNewSubtask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = subtasks.filter((st) => st.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask);
      setNewSubtask('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-6 space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Subtarefas ({completedCount}/{totalCount})
        </h3>
        {totalCount > 0 && (
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-3 rounded-md bg-white p-3 dark:bg-slate-700"
          >
            <button
              onClick={() => onToggleSubtask(subtask.id, !subtask.completed)}
              className="flex-shrink-0 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {subtask.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <span
              className={`flex-grow ${
                subtask.completed
                  ? 'line-through text-slate-500'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {subtask.title}
            </span>

            <button
              onClick={() => onDeleteSubtask(subtask.id)}
              className="flex-shrink-0 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Adicionar nova subtarefa..."
            className="flex-grow rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewSubtask('');
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-blue-500 hover:text-blue-500 dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          <Plus className="h-4 w-4" />
          Adicionar subtarefa
        </button>
      )}
    </div>
  );
}

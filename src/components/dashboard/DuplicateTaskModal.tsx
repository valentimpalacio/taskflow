'use client';

import { useState } from 'react';
import { Copy, Save, FolderOpen } from 'lucide-react';
import { Task, Project } from '@/types';

interface DuplicateTaskModalProps {
  task?: Task;
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: (data: {
    title: string;
    description?: string;
    count: number;
    makeTemplate: boolean;
    templateName?: string;
  }) => void;
}

export default function DuplicateTaskModal({
  task,
  project,
  isOpen,
  onClose,
  onDuplicate,
}: DuplicateTaskModalProps) {
  const [title, setTitle] = useState(task?.title || project?.name || '');
  const [description, setDescription] = useState(
    task?.description || project?.description || ''
  );
  const [count, setCount] = useState(1);
  const [makeTemplate, setMakeTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDuplicate({
      title,
      description,
      count,
      makeTemplate,
      templateName: makeTemplate ? templateName : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-2">
          <Copy className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Duplicar {task ? 'Tarefa' : 'Projeto'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Número de cópias
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value)))}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={makeTemplate}
                onChange={(e) => setMakeTemplate(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Salvar como template reutilizável
              </span>
            </label>

            {makeTemplate && (
              <div className="mt-3">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Nome do template (ex: Website Project)"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              <Save className="h-4 w-4" />
              Duplicar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-medium dark:border-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

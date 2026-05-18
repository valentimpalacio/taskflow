'use client';

import { useState } from 'react';
import { Webhook, Zap, Trash2, Copy, Check } from 'lucide-react';
import { Webhook as WebhookType } from '@/types';

interface WebhookManagerProps {
  webhooks: WebhookType[];
  onAddWebhook: (url: string, events: string[]) => void;
  onDeleteWebhook: (id: string) => void;
  onToggleWebhook: (id: string, active: boolean) => void;
}

const AVAILABLE_EVENTS = [
  { id: 'task.created', label: 'Tarefa criada' },
  { id: 'task.updated', label: 'Tarefa atualizada' },
  { id: 'task.deleted', label: 'Tarefa deletada' },
  { id: 'task.completed', label: 'Tarefa concluída' },
  { id: 'comment.created', label: 'Comentário criado' },
  { id: 'project.updated', label: 'Projeto atualizado' },
];

export default function WebhookManager({
  webhooks,
  onAddWebhook,
  onDeleteWebhook,
  onToggleWebhook,
}: WebhookManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && selectedEvents.length > 0) {
      onAddWebhook(url, selectedEvents);
      setUrl('');
      setSelectedEvents([]);
      setIsAdding(false);
    }
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopied(secret);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 dark:bg-slate-800">
      <div className="mb-6 flex items-center gap-2">
        <Zap className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Webhooks
        </h2>
      </div>

      {isAdding ? (
        <form onSubmit={handleAddWebhook} className="mb-6 space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL do Webhook
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Eventos
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_EVENTS.map((event) => (
                <label key={event.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEvent(event.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {event.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!url.trim() || selectedEvents.length === 0}
              className="flex-1 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Criar Webhook
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setUrl('');
                setSelectedEvents([]);
              }}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-medium dark:border-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mb-6 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          + Novo Webhook
        </button>
      )}

      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <p className="py-4 text-center text-slate-500 dark:text-slate-400">
            Nenhum webhook configurado
          </p>
        ) : (
          webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-grow">
                  <p className="font-medium text-slate-900 dark:text-white break-all">
                    {webhook.url}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {webhook.events.length} evento(s) | Última atividade:{' '}
                    {webhook.lastTriggered
                      ? new Date(webhook.lastTriggered).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={webhook.active}
                    onChange={(e) => onToggleWebhook(webhook.id, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Ativo
                  </span>
                </label>
              </div>

              <div className="mb-3 flex flex-wrap gap-1">
                {webhook.events.map((event) => (
                  <span
                    key={event}
                    className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {event}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copySecret(webhook.secret)}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                    copied === webhook.secret
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {copied === webhook.secret ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copiar Secret
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteWebhook(webhook.id)}
                  className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

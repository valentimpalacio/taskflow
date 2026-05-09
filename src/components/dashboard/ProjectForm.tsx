'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from './Toast';
import { Plus, X, FolderKanban } from 'lucide-react';

export default function ProjectForm({ onCreated }: { onCreated: () => void }) {
  const t = useTranslations('dashboard');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || undefined }),
      });
      if (res.ok) {
        setName(''); setDescription('');
        setOpen(false);
        showToast(t('projectCreated'), 'success');
        onCreated();
      } else {
        const data = await res.json();
        showToast(data.error || t('error'), 'error');
      }
    } catch { showToast(t('error'), 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/45 transition-all btn-pulse"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">{t('newProject')}</span>
        <span className="sm:hidden">{t('newProject')}</span>
      </button>
      {open && (
        <form onSubmit={handleSubmit}
          className="mt-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xl animate-fade-in-down"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('newProject')}</h3>
          </div>
          <input
            type="text" placeholder={t('projectName')} value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none mb-3 transition-all"
            autoFocus
          />
          <textarea placeholder={t('description')} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none mb-4 resize-none transition-all" rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading || !name.trim()}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {t('create')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
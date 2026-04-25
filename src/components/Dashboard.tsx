'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Project } from '@/types';
import Header from './dashboard/Header';
import StatsCards from './dashboard/StatsCards';
import ProjectForm from './dashboard/ProjectForm';
import TaskForm from './dashboard/TaskForm';
import ProjectList from './dashboard/ProjectList';
import KanbanBoard from './dashboard/KanbanBoard';
import AllTasks from './dashboard/AllTasks';
import { ToastProvider } from './dashboard/Toast';

type ViewMode = 'board' | 'list';

function DashboardContent() {
  const { data: session, status } = useSession();
  const t = useTranslations('dashboard');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'pt';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('board');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch {
      // Silently handle network errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl skeleton" />
            ))}
          </div>
          <div className="h-64 rounded-2xl skeleton" />
        </div>
      </div>
    );
  }

  const btnCls = 'px-4 py-1.5 rounded-lg text-sm font-medium transition-all';
  const btnActive = 'bg-primary-600 text-white shadow-sm';
  const btnInactive = 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards projects={projects} />
        <div className="flex flex-wrap items-center gap-3 mt-8 mb-6">
          <ProjectForm onCreated={fetchProjects} />
          <TaskForm projects={projects} onCreated={fetchProjects} />
          <div className="flex-1" />
          <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
            <button
              onClick={() => setView('board')}
              className={`${btnCls} ${view === 'board' ? btnActive : btnInactive}`}
            >
              {t('kanban')}
            </button>
            <button
              onClick={() => setView('list')}
              className={`${btnCls} ${view === 'list' ? btnActive : btnInactive}`}
            >
              {t('list')}
            </button>
          </div>
        </div>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t('projects')}
          </h2>
          <ProjectList projects={projects} onRefresh={fetchProjects} />
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t('tasks')}
          </h2>
          {view === 'board' ? (
            <KanbanBoard projects={projects} onRefresh={fetchProjects} />
          ) : (
            <AllTasks projects={projects} onRefresh={fetchProjects} />
          )}
        </section>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Project } from '@/types';
import Header from './dashboard/Header';
import StatsCards from './dashboard/StatsCards';
import ProjectForm from './dashboard/ProjectForm';
import TaskForm from './dashboard/TaskForm';
import ProjectList from './dashboard/ProjectList';
import KanbanBoard from './dashboard/KanbanBoard';
import AllTasks from './dashboard/AllTasks';
import ProductivityChart from './dashboard/ProductivityChart';
import GanttChartView from './dashboard/GanttChartView';
import { ToastProvider } from './dashboard/Toast';
import { useProjects } from '@/lib/hooks/useProjects';
import { useQueryClient } from '@tanstack/react-query';
import { Search, Filter, X, LayoutGrid, List, Calendar, Plus, FolderPlus } from 'lucide-react';

type ViewMode = 'board' | 'list' | 'gantt';

function DashboardContent() {
  const { data: session, status } = useSession();
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading: loading } = useProjects({ enabled: status === 'authenticated' });
  const [view, setView] = useState<ViewMode>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showProjectForm, setShowProjectForm] = useState(false);

  // All hooks must be called before any early returns (React Rules of Hooks)
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [queryClient]);

  const filteredProjects = useMemo(() => {
    if (selectedProjectId === 'all') {
      return projects;
    }
    return projects.filter(project => project.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const allTasks = useMemo(() => {
    return filteredProjects.flatMap(project =>
      (project.tasks || []).map(task => ({
        ...task,
        projectName: project.name,
        projectId: project.id
      }))
    );
  }, [filteredProjects]);

  const handleAddDependency = useCallback(async (dependentTaskId: string, blockingTaskId: string) => {
    try {
      const response = await fetch('/api/tasks/dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependentTaskId, blockingTaskId }),
      });

      if (response.ok) {
        refreshData();
      }
    } catch (error) {
      console.error('Error adding dependency:', error);
    }
  }, [refreshData]);

  const handleRemoveDependency = useCallback(async (dependencyId: string) => {
    try {
      const response = await fetch(`/api/tasks/dependencies/${dependencyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshData();
      }
    } catch (error) {
      console.error('Error removing dependency:', error);
    }
  }, [refreshData]);

  // Get available projects for TaskForm (excluding "all" option)
  const availableProjects = projects.filter(project => project.id !== 'all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Don't render anything until we know auth status
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loading && projects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('noProjects')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('createFirstProject')}
            </p>
            <ProjectForm onCreated={refreshData} />
          </div>
        ) : (
          <>
            {/* Top toolbar: view switcher + project filter + action buttons */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <div className="flex items-center gap-3">
                {/* View mode switcher */}
                <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setView('board')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all ${
                      view === 'board'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    {tc('board')}
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all ${
                      view === 'list'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    {tc('list')}
                  </button>
                  <button
                    onClick={() => setView('gantt')}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all ${
                      view === 'gantt'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {tc('gantt')}
                  </button>
                </div>

                {/* Project filter dropdown */}
                <select
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="all">{t('allProjects')}</option>
                  {availableProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <TaskForm
                  projects={availableProjects}
                  onCreated={refreshData}
                />
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/45 transition-all text-sm"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('newProject')}</span>
                </button>
              </div>
            </div>

            {/* Project creation form (collapsible) */}
            {showProjectForm && (
              <div className="mb-6">
                <ProjectForm onCreated={() => { refreshData(); setShowProjectForm(false); }} />
              </div>
            )}

            {view === 'board' && (
              <KanbanBoard
                projects={filteredProjects}
                onRefresh={refreshData}
              />
            )}

            {view === 'list' && (
              <AllTasks
                projects={filteredProjects}
                onRefresh={refreshData}
              />
            )}

            {view === 'gantt' && (
              <GanttChartView
                tasks={allTasks}
                onAddDependency={handleAddDependency}
                onRemoveDependency={handleRemoveDependency}
              />
            )}

            <StatsCards projects={filteredProjects} />
            <ProductivityChart projects={filteredProjects} />
          </>
        )}
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

'use client';

import { useState, useEffect } from 'react';
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
import { useMemo } from 'react';
import { Search, Filter, X, LayoutGrid, List, Calendar } from 'lucide-react';

type ViewMode = 'board' | 'list' | 'gantt';

function DashboardContent() {
  const { data: session, status } = useSession();
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading: loading } = useProjects();
  const [view, setView] = useState<ViewMode>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  useEffect(() => {
    // Only redirect when we are CERTAIN the user is not authenticated.
    // Never redirect during 'loading' — this avoids false redirects when
    // the SessionProvider remounts after a locale change.
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  // Don't render anything until we know auth status
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

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

  const handleAddDependency = async (dependentTaskId: string, blockingTaskId: string) => {
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
  };

  const handleRemoveDependency = async (dependencyId: string) => {
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
  };

  // Get available projects for TaskForm (excluding "all" option)
  const availableProjects = projects.filter(project => project.id !== 'all');

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
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setView('board')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    view === 'board' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  {tc('board')}
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    view === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                  {tc('list')}
                </button>
                <button
                  onClick={() => setView('gantt')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    view === 'gantt' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {tc('gantt')}
                </button>
              </div>
              
              {selectedProjectId !== 'all' && availableProjects.length > 0 && (
                <TaskForm 
                  projects={availableProjects} 
                  onCreated={refreshData} 
                />
              )}
            </div>

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
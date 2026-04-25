'use client';

import { Project, Task } from '@/types';
import { useTranslations } from 'next-intl';

interface Props {
  projects: Project[];
}

export default function StatsCards({ projects }: Props) {
  const t = useTranslations('stats');
  const allTasks: Task[] = projects.flatMap((p) => p.tasks);
  const todo = allTasks.filter((t) => t.status === 'todo').length;
  const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  const done = allTasks.filter((t) => t.status === 'done').length;
  const completionRate =
    allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0;

  const cards = [
    {
      label: t('totalProjects'),
      value: projects.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
      color: 'from-primary-500 to-primary-600',
      shadowColor: 'shadow-primary-500/20',
    },
    {
      label: t('totalTasks'),
      value: allTasks.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-slate-400 to-slate-500',
      shadowColor: 'shadow-slate-500/20',
    },
    {
      label: t('inProgressTasks'),
      value: inProgress,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'from-amber-400 to-amber-500',
      shadowColor: 'shadow-amber-500/20',
    },
    {
      label: t('completedTasks'),
      value: done,
      sub: allTasks.length > 0 ? `${completionRate}%` : undefined,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-500',
      shadowColor: 'shadow-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg ${card.shadowColor} hover:shadow-xl hover:-translate-y-0.5 cursor-default transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
              {card.sub && (
                <p className="text-sm text-white/70 mt-0.5">
                  {card.sub} complete
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

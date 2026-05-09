'use client';

import { Project, Task } from '@/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { FolderKanban, ListChecks, Zap, Trophy } from 'lucide-react';

interface Props {
  projects: Project[];
}

function AnimatedNumber({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 800;
          const step = Math.max(1, Math.floor(value / 30));
          const interval = setInterval(() => {
            start += step;
            if (start >= value) {
              setDisplay(value);
              clearInterval(interval);
            } else {
              setDisplay(start);
            }
          }, duration / (value / step || 1));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className="text-3xl font-bold tabular-nums">{display}</span>;
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
      icon: <FolderKanban className="w-5 h-5" />,
      gradient: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/25',
      lightBg: 'bg-violet-50 dark:bg-violet-950/30',
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: t('totalTasks'),
      value: allTasks.length,
      icon: <ListChecks className="w-5 h-5" />,
      gradient: 'from-slate-500 to-slate-600',
      shadow: 'shadow-slate-500/25',
      lightBg: 'bg-slate-50 dark:bg-slate-800/50',
      iconBg: 'bg-slate-100 dark:bg-slate-700/40',
      iconColor: 'text-slate-600 dark:text-slate-400',
    },
    {
      label: t('inProgressTasks'),
      value: inProgress,
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-amber-400 to-amber-500',
      shadow: 'shadow-amber-500/25',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: t('completedTasks'),
      value: done,
      sub: allTasks.length > 0 ? `${completionRate}% complete` : undefined,
      icon: <Trophy className="w-5 h-5" />,
      gradient: 'from-emerald-400 to-emerald-500',
      shadow: 'shadow-emerald-500/25',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className={`relative ${card.lightBg} rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-lg ${card.shadow} hover:-translate-y-1 cursor-default transition-all duration-300 animate-fade-in-up stagger-${idx + 1}`}
        >
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-60`} />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                {card.label}
              </p>
              <p className="text-3xl font-bold mt-1.5 text-slate-900 dark:text-white tabular-nums">
                <AnimatedNumber value={card.value} label={card.label} />
              </p>
              {card.sub && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full bg-emerald-500`} />
                  {card.sub}
                </p>
              )}
            </div>
            <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconColor}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
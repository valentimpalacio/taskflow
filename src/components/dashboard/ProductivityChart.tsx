'use client';

import { useMemo } from 'react';
import { Project, Task } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';

interface Props {
  projects: Project[];
}

export default function ProductivityChart({ projects }: Props) {
  const t = useTranslations('dashboard');

  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const allTasks = projects.flatMap((p) => p.tasks || []);
    const completedTasks = allTasks.filter((t) => t.status === 'done');

    return last7Days.map((date) => {
      const count = completedTasks.filter((task) => {
        const taskDate = new Date(task.updatedAt || task.createdAt)
          .toISOString()
          .split('T')[0];
        return taskDate === date;
      }).length;

      const [y, m, d] = date.split('-');
      return {
        date: `${d}/${m}`,
        count,
      };
    });
  }, [projects]);

  const totalCompleted = data.reduce((acc, d) => acc + d.count, 0);
  const hasData = totalCompleted > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {t('productivity')}
        </h3>
        {hasData && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            {totalCompleted} completed
          </div>
        )}
      </div>
      <div className="h-64 w-full min-h-[256px] min-w-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '13px',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? '#6366f1' : '#e2e8f0'}
                  className={entry.count > 0 ? 'hover:opacity-80' : ''}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
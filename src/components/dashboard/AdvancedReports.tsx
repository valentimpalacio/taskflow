'use client';

import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Task } from '@/types';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Download } from 'lucide-react';

interface AdvancedReportsProps {
  tasks: Task[];
  projectName: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

export default function AdvancedReports({ tasks, projectName }: AdvancedReportsProps) {
  const reportData = useMemo(() => {
    // Task status distribution
    const statusData = [
      { name: 'Não iniciada', value: tasks.filter((t) => t.status === 'todo').length },
      { name: 'Em progresso', value: tasks.filter((t) => t.status === 'in_progress').length },
      { name: 'Concluída', value: tasks.filter((t) => t.status === 'done').length },
    ];

    // Priority distribution
    const priorityData = [
      { name: 'Baixa', value: tasks.filter((t) => t.priority === 'LOW').length },
      { name: 'Média', value: tasks.filter((t) => t.priority === 'MEDIUM').length },
      { name: 'Alta', value: tasks.filter((t) => t.priority === 'HIGH').length },
    ];

    // Productivity last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    const productivityData = last7Days.map((date) => {
      const completed = tasks.filter(
        (t) => t.status === 'done' && t.updatedAt && isSameDay(new Date(t.updatedAt), date)
      ).length;
      return {
        date: format(date, 'dd/MM'),
        completed,
      };
    });

    // Burndown data (estimated vs actual)
    const burndownData = last7Days.map((date, index) => {
      const totalTasks = tasks.length;
      const completedCount = tasks.filter(
        (t) => t.status === 'done' && t.updatedAt && new Date(t.updatedAt) <= date
      ).length;
      const remaining = totalTasks - completedCount;
      const estimatedRemaining = Math.max(0, totalTasks - Math.round((totalTasks / 7) * (index + 1)));

      return {
        date: format(date, 'dd/MM'),
        actual: remaining,
        estimated: estimatedRemaining,
      };
    });

    return {
      statusData,
      priorityData,
      productivityData,
      burndownData,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'done').length,
      overdueTasks: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
      ).length,
    };
  }, [tasks]);

  const exportPDF = () => {
    // This would require a library like jsPDF
    // For now, we'll just log a message
    alert('Exportação PDF será implementada com jsPDF');
  };

  const completionRate = reportData.totalTasks > 0
    ? Math.round((reportData.completedTasks / reportData.totalTasks) * 100)
    : 0;

  return (
    <div className="mt-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total de Tarefas</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {reportData.totalTasks}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-4 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">Concluídas</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">
            {reportData.completedTasks}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{completionRate}% completo</p>
        </div>

        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Vencidas</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-1">
            {reportData.overdueTasks}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Taxa de Conclusão</p>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{completionRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Distribuição por Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportData.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Distribuição por Prioridade
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Chart */}
        <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Produtividade - Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportData.productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Concluídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Burndown Chart */}
        <div className="rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Gráfico de Burndown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reportData.burndownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#EF4444"
                name="Tarefas Restantes"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="estimated"
                stroke="#3B82F6"
                name="Estimado"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          <Download className="h-4 w-4" />
          Exportar Relatório em PDF
        </button>
      </div>
    </div>
  );
}

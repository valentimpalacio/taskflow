'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

export default function CalendarView({
  tasks,
  onDayClick,
  onTaskClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-blue-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="w-full rounded-lg bg-white p-6 dark:bg-slate-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium"
          >
            Hoje
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              onClick={() => onDayClick?.(day)}
              className={`min-h-[100px] rounded-lg p-2 cursor-pointer transition-colors ${
                isCurrentMonth
                  ? 'bg-white dark:bg-slate-700'
                  : 'bg-slate-50 dark:bg-slate-800'
              } ${
                isToday
                  ? 'ring-2 ring-blue-500'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700'
              } border border-slate-200 dark:border-slate-600`}
            >
              <p
                className={`text-xs font-bold mb-1 ${
                  isToday
                    ? 'text-blue-500'
                    : isCurrentMonth
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400'
                }`}
              >
                {format(day, 'd')}
              </p>

              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={`block w-full rounded px-1.5 py-0.5 text-left text-xs truncate text-white font-medium hover:opacity-90 ${getPriorityColor(
                      task.priority
                    )}`}
                    title={task.title}
                  >
                    {task.title}
                  </button>
                ))}

                {dayTasks.length > 3 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
                    +{dayTasks.length - 3} mais
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

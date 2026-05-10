'use client';

import { useState, useMemo } from 'react';
import { format, parseISO, isBefore, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Link as LinkIcon, Unlink } from 'lucide-react';
import { Task } from '@/types';

interface GanttChartViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddDependency?: (taskId: string, blockingTaskId: string) => void;
  onRemoveDependency?: (dependencyId: string) => void;
}

interface GanttTask {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  dependsOn: string[];
  blocks: string[];
}

export default function GanttChartView({
  tasks,
  onTaskClick,
  onAddDependency,
  onRemoveDependency,
}: GanttChartViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showDependencySelector, setShowDependencySelector] = useState(false);

  // Convert tasks to Gantt format
  const ganttTasks = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      startDate: task.createdAt ? new Date(task.createdAt) : null,
      endDate: task.dueDate ? new Date(task.dueDate) : null,
      status: task.status,
      dependsOn: task.dependsOn?.map(dep => dep.blockingTaskId) || [],
      blocks: task.blocks?.map(dep => dep.dependentTaskId) || [],
    }));
  }, [tasks]);

  const getTaskDuration = (startDate: Date | null, endDate: Date | null): number => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'todo': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };

  const handleAddDependency = (blockingTaskId: string) => {
    if (selectedTask && onAddDependency) {
      onAddDependency(selectedTask, blockingTaskId);
    }
    setShowDependencySelector(false);
  };

  // Generate date range for display (30 days)
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - 15);
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + 15);
  
  const dateRange = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Gantt Chart</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setMonth(newDate.getMonth() - 1);
              return newDate;
            })}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setMonth(newDate.getMonth() + 1);
              return newDate;
            })}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Header with dates */}
        <div className="flex mb-4">
          <div className="w-64 min-w-64 p-2 font-medium text-gray-700 dark:text-gray-300">Task</div>
          <div className="flex flex-1">
            {dateRange.map((date, index) => (
              <div 
                key={index} 
                className="flex-1 p-2 text-xs text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
              >
                {format(date, 'MMM dd')}
              </div>
            ))}
          </div>
        </div>

        {/* Task rows */}
        {ganttTasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-center mb-2 p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
              selectedTask === task.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
            }`}
            onClick={() => {
              handleTaskSelect(task.id);
              if (onTaskClick) {
                const originalTask = tasks.find(t => t.id === task.id);
                if (originalTask) onTaskClick(originalTask);
              }
            }}
          >
            <div className="w-64 min-w-64">
              <div className="font-medium text-gray-800 dark:text-white">{task.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {task.status.replace('_', ' ')}
              </div>
              {task.dependsOn.length > 0 && (
                <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Depends on {task.dependsOn.length} task(s)
                </div>
              )}
            </div>
            
            <div className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-700 rounded">
              {task.startDate && task.endDate && !isNaN(task.startDate.getTime()) && !isNaN(task.endDate.getTime()) && (
                <>
                  {/* Task bar */}
                  <div 
                    className={`absolute top-1 h-6 rounded ${getStatusColor(task.status)}`}
                    style={{
                      left: `${Math.max(0, (task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * (100 / dateRange.length)}%`,
                      width: `${getTaskDuration(task.startDate, task.endDate) * (100 / dateRange.length)}%`,
                    }}
                  />
                  
                  {/* Dependency arrows */}
                  {task.dependsOn.map((depId, idx) => {
                    const depTask = ganttTasks.find(t => t.id === depId);
                    if (depTask && depTask.endDate && !isNaN(depTask.endDate.getTime())) {
                      const depEndPos = (depTask.endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                      const taskStartPos =
                        (task.startDate!.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) || 0;
                      
                      if (depEndPos >= 0 && taskStartPos >= 0) {
                        return (
                          <svg 
                            key={idx} 
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ zIndex: 10 }}
                          >
                            <defs>
                              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                      refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                              </marker>
                            </defs>
                            <line 
                              x1={`${depEndPos * (100 / dateRange.length)}%`} 
                              y1="50%" 
                              x2={`${taskStartPos * (100 / dateRange.length)}%`} 
                              y2="50%" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              markerEnd="url(#arrowhead)"
                              className="text-blue-500"
                            />
                          </svg>
                        );
                      }
                    }
                    return null;
                  })}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Dependency creation UI */}
        {selectedTask && showDependencySelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Add Dependency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a task that must be completed before "{tasks.find(t => t.id === selectedTask)?.title}"
              </p>
              <div className="max-h-60 overflow-y-auto">
                {tasks
                  .filter(task => task.id !== selectedTask)
                  .map(task => (
                    <button
                      key={task.id}
                      onClick={() => handleAddDependency(task.id)}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mb-1"
                    >
                      {task.title}
                    </button>
                  ))
                }
              </div>
              <button
                onClick={() => setShowDependencySelector(false)}
                className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedTask && !showDependencySelector && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowDependencySelector(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Add Dependency
            </button>
            <button
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type NotificationType = 'TASK_DUE' | 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'COMMENT_MENTION' | 'PROJECT_SHARED' | 'TASK_COMMENTED';
export type AccessRole = 'OWNER' | 'EDITOR' | 'COMMENTER' | 'VIEWER';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  projectId: string;
  userId?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  subtasks?: Subtask[];
  parentTaskId?: string;
  tags?: Tag[];
  
  // New dependency fields
  dependsOn?: {
    id: string;
    blockingTaskId: string;
    type: 'FINISH_TO_START' | 'START_TO_START' | 'FINISH_TO_FINISH' | 'START_TO_FINISH';
  }[];
  blocks?: {
    id: string;
    dependentTaskId: string;
    type: 'FINISH_TO_START' | 'START_TO_START' | 'FINISH_TO_FINISH' | 'START_TO_FINISH';
  }[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user?: User;
  taskId?: string | null;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
  mentions?: string[];
  parentId?: string | null;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  userId: string;
  taskId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  dueAt?: string | null;
}

export interface ProjectAccess {
  id: string;
  projectId: string;
  userId: string;
  user?: User;
  role: AccessRole;
  createdAt: string;
}

export interface Webhook {
  id: string;
  projectId: string;
  userId: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastTriggered?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  tasks?: Task[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  projectAccess?: ProjectAccess[];
  isTemplate: boolean;
  templateName?: string | null;
  webhooks?: Webhook[];
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
}

export const TASK_STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  todo: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-400' },
  in_progress: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-400' },
  done: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-400' },
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; badge: string }> = {
  LOW: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-200' },
  MEDIUM: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', badge: 'bg-yellow-200' },
  HIGH: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-200' },
};

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  TASK_DUE: '⏰',
  TASK_ASSIGNED: '👤',
  TASK_UPDATED: '✏️',
  COMMENT_MENTION: '💬',
  PROJECT_SHARED: '🔗',
  TASK_COMMENTED: '💭',
};

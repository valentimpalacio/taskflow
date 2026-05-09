'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, CheckAll } from 'lucide-react';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useLocale } from 'next-intl';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

const localeMap = {
  pt: ptBR,
  en: enUS,
  es: es,
};

const NOTIFICATION_COLORS = {
  TASK_DUE: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  TASK_ASSIGNED: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  TASK_UPDATED: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  COMMENT_MENTION: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
  PROJECT_SHARED: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  TASK_COMMENTED: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700',
};

const NOTIFICATION_ICONS = {
  TASK_DUE: '⏰',
  TASK_ASSIGNED: '👤',
  TASK_UPDATED: '✏️',
  COMMENT_MENTION: '💬',
  PROJECT_SHARED: '🔗',
  TASK_COMMENTED: '💭',
};

export default function NotificationBell({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const locale = useLocale() as 'pt' | 'en' | 'es';

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-notification-bell]')) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" data-notification-bell>
      <button
        onClick={() => {
          setIsDropdownVisible(!isDropdownVisible);
          setIsOpen(true);
        }}
        className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isDropdownVisible && (
        <div className="absolute right-0 top-12 w-96 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
          <div className="border-b border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Notificações
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                >
                  <CheckAll className="h-4 w-4" />
                  Marcar tudo como lido
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Nenhuma notificação 🎉
              </div>
            ) : (
              <div className="space-y-0">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 text-xl">
                        {NOTIFICATION_ICONS[notification.type]}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {notification.message}
                            </p>
                          </div>

                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="flex-shrink-0 text-blue-500 hover:text-blue-600"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: localeMap[locale],
                            })}
                          </p>

                          <button
                            onClick={() => onDeleteNotification(notification.id)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

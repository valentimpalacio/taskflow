'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
  JSX,
} from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  }, []);

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const styles: Record<ToastType, { bg: string; border: string; icon: JSX.Element }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/60',
      border: 'border-red-200 dark:border-red-800/50',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-primary-50 dark:bg-primary-950/60',
      border: 'border-primary-200 dark:border-primary-800/50',
      icon: <AlertCircle className="w-5 h-5 text-primary-500" />,
    },
  };

  const textStyles: Record<ToastType, string> = {
    success: 'text-emerald-800 dark:text-emerald-300',
    error: 'text-red-800 dark:text-red-300',
    info: 'text-primary-800 dark:text-primary-300',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => {
          const s = styles[toast.type];
          return (
            <div
              key={toast.id}
              className={`${s.bg} ${s.border} border backdrop-blur-md text-slate-900 dark:text-white px-4 py-3.5 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 flex items-start gap-3 cursor-pointer toast-enter min-w-[300px]`}
              onClick={() => removeToast(toast.id)}
            >
              <span className="mt-0.5 flex-shrink-0">{s.icon}</span>
              <span className={`text-sm font-medium flex-1 ${textStyles[toast.type]}`}>
                {toast.message}
              </span>
              <button className="p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
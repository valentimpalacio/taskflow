'use client';

import { Component, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

class I18nSafeLoadingBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-900 dark:to-primary-950/20">
      <div className="text-center animate-fade-in-up">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 animate-pulse opacity-30" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        <div className="flex gap-1.5 justify-center mt-3">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}

function TranslatedLoading() {
  let t: (key: string) => string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useTranslations } = require('next-intl');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    t = useTranslations('common');
  } catch {
    t = (key: string) => (key === 'loading' ? 'Loading...' : key);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-900 dark:to-primary-950/20">
      <div className="text-center animate-fade-in-up">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 animate-pulse opacity-30" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('loading')}</p>
        <div className="flex gap-1.5 justify-center mt-3">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <I18nSafeLoadingBoundary fallback={<LoadingFallback />}>
      <TranslatedLoading />
    </I18nSafeLoadingBoundary>
  );
}

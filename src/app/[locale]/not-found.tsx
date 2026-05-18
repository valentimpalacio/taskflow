import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50/30 dark:from-slate-900 dark:to-primary-950/20 px-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-950/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/10 ring-1 ring-primary-200 dark:ring-primary-800/30">
          <SearchX className="w-10 h-10 text-primary-500" />
        </div>
        <p className="text-8xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 leading-none">
          404
        </p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {t('notFound')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          {t('notFoundDescription')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/45 transition-all"
        >
          <Home className="w-4 h-4" />
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
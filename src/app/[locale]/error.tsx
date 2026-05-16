'use client';

import { useEffect, Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Hardcoded fallback strings in case the i18n provider is broken.
const FALLBACK = {
  title: 'Something went wrong!',
  description: 'An unexpected error occurred. Please try again.',
  retry: 'Try again',
};

const I18N_ERROR_MESSAGES: Record<string, { title: string; description: string; retry: string }> = {
  pt: {
    title: 'Algo deu errado!',
    description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    retry: 'Tentar novamente',
  },
  en: {
    title: 'Something went wrong!',
    description: 'An unexpected error occurred. Please try again.',
    retry: 'Try again',
  },
  es: {
    title: '¡Algo salió mal!',
    description: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
    retry: 'Intentar de nuevo',
  },
};

/**
 * Inner boundary that catches errors thrown by useTranslations
 * (e.g. when NextIntlClientProvider itself crashed).
 */
class I18nSafeBoundary extends Component<
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

function ErrorUI({
  title,
  description,
  retry,
  onReset,
}: {
  title: string;
  description: string;
  retry: string;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-slate-900 dark:to-red-950/20 px-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10 ring-1 ring-red-200 dark:ring-red-800/30">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          {description}
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/45 flex items-center gap-2 mx-auto transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {retry}
        </button>
      </div>
    </div>
  );
}

/** Tenta usar i18n, mas com fallback hardcoded por locale caso o provider esteja quebrado. */
function TranslatedErrorUI({ onReset, locale }: { onReset: () => void; locale?: string }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useTranslations } = require('next-intl');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations('common');
    return (
      <ErrorUI
        title={t('somethingWentWrong')}
        description={t('errorDescription')}
        retry={t('tryAgain')}
        onReset={onReset}
      />
    );
  } catch {
    // Fallback para mensagens hardcoded quando next-intl não está disponível
    const localeMessages = locale && I18N_ERROR_MESSAGES[locale]
      ? I18N_ERROR_MESSAGES[locale]
      : I18N_ERROR_MESSAGES['en'];
    return (
      <ErrorUI
        title={localeMessages.title}
        description={localeMessages.description}
        retry={localeMessages.retry}
        onReset={onReset}
      />
    );
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Extract locale from the pathname if available
  let locale: string | undefined;
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/(pt|en|es)\b/);
    if (match) locale = match[1];
  }

  return (
    <I18nSafeBoundary
      fallback={<ErrorUI {...FALLBACK} onReset={reset} />}
    >
      <TranslatedErrorUI onReset={reset} locale={locale} />
    </I18nSafeBoundary>
  );
}
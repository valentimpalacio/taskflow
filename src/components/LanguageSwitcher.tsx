'use client';

import { useLocale } from 'next-intl';
import { languages, languageNames, Language } from '@/i18n/config';

type LanguageSwitcherProps = {
  /** Preserved as query string when switching locale (e.g. email on sign-in). */
  extraSearchParams?: Record<string, string>;
};

export default function LanguageSwitcher({ extraSearchParams }: LanguageSwitcherProps = {}) {
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    if (!languages.includes(newLocale as Language)) {
      console.error(`Invalid locale: ${newLocale}`);
      return;
    }

    // Strip locale prefix from current pathname using window.location directly
    // to avoid usePathname() returning paths with locale included
    const currentPath = typeof window !== 'undefined'
      ? window.location.pathname.replace(/^\/(pt|en|es)(\/.*)?$/, '$2') || '/'
      : '/';

    const qs =
      extraSearchParams && Object.keys(extraSearchParams).length > 0
        ? `?${new URLSearchParams(extraSearchParams).toString()}`
        : '';

    // Set cookie so middleware picks it up on the next request
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

    // Full page navigation to avoid client-side reconciliation issues
    window.location.href = `/${newLocale}${currentPath}${qs}`;
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            locale === lang
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          title={languageNames[lang]}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

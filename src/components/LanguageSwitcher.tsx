'use client';

import { useLocale } from 'next-intl';
import { languages, languageNames, Language } from '@/i18n/config';
import { usePathname } from '@/i18n/navigation';

type LanguageSwitcherProps = {
  /** Preserved as query string when switching locale (e.g. email on sign-in). */
  extraSearchParams?: Record<string, string>;
};

export default function LanguageSwitcher({ extraSearchParams }: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    if (!languages.includes(newLocale as Language)) return;

    const qs =
      extraSearchParams && Object.keys(extraSearchParams).length > 0
        ? `?${new URLSearchParams(extraSearchParams).toString()}`
        : '';

    // Use full page navigation to avoid session race conditions during
    // client-side locale transitions (prevents "Something went wrong!" error)
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;samesite=lax`;
    window.location.href = `/${newLocale}${pathname}${qs}`;
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
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          title={languageNames[lang]}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

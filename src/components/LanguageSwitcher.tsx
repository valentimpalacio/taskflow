'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { languages, languageNames, Language } from '@/i18n/config';
import { useRouter as useIntlRouter, usePathname } from '@/i18n/navigation';

type LanguageSwitcherProps = {
  /** Preserved as query string when switching locale (e.g. email on sign-in). */
  extraSearchParams?: Record<string, string>;
};

export default function LanguageSwitcher({ extraSearchParams }: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const intlRouter = useIntlRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale || isLoading) return;
    
    // Validate that the locale is valid
    if (!languages.includes(newLocale as Language)) {
      console.error(`Invalid locale: ${newLocale}`);
      return;
    }

    setIsLoading(true);
    try {
      const qs =
        extraSearchParams && Object.keys(extraSearchParams).length > 0
          ? `?${new URLSearchParams(extraSearchParams).toString()}`
          : '';
      intlRouter.replace(`${pathname}${qs}`, { locale: newLocale as Language });
    } catch (error) {
      console.error(`Language switch failed from ${locale} to ${newLocale}:`, error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          disabled={isLoading}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            locale === lang
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={languageNames[lang]}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

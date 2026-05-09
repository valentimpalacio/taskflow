'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { languages, languageNames, Language } from '@/i18n/config';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

interface LanguageSwitcherProps {
  extraSearchParams?: Record<string, string>;
}

export default function LanguageSwitcher({ extraSearchParams }: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale || isLoading) return;
    
    // Validate that the locale is valid
    if (!languages.includes(newLocale as Language)) {
      console.error(`Invalid locale: ${newLocale}`);
      return;
    }

    setIsLoading(true);
    try {
      // Merge current search params with any extra params passed by the parent
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      if (extraSearchParams) {
        Object.entries(extraSearchParams).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
        });
      }
      const queryString = params.toString();
      const pathWithSearch = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(pathWithSearch, { locale: newLocale as Language });
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
          type="button"
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

'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { languages, languageNames, Language } from '@/i18n/config';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLocale: Language) => {
    if (newLocale === locale || isLoading) return;

    setIsLoading(true);
    try {
      console.log(`Switching language from ${locale} to ${newLocale}`);
      router.replace(pathname, { locale: newLocale });
      setIsLoading(false);
    } catch (error) {
      console.error(`Language switch failed: ${error}`);
      setIsLoading(false);
    }
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

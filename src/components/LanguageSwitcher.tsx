'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { languages, languageNames } from '@/i18n/config';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const getHref = (lang: string) => {
    // Remove locale prefix from pathname
    const pathWithoutLocale = pathname.startsWith(`/${locale}`)
      ? pathname.slice(locale.length + 1)
      : pathname;

    // Build new path
    if (lang === 'pt') {
      return pathWithoutLocale || '/';
    }
    return `/${lang}${pathWithoutLocale || ''}`;
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <Link
          key={lang}
          href={getHref(lang)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            locale === lang
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          title={languageNames[lang]}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

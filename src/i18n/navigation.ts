import { createNavigation } from 'next-intl/navigation';
import { languages, defaultLanguage } from './config';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ 
    locales: languages, 
    defaultLocale: defaultLanguage,
    localePrefix: 'always'
  });

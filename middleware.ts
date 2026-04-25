import createMiddleware from 'next-intl/middleware';
import { languages, defaultLanguage } from './src/i18n/config';

export default createMiddleware({
  locales: languages,
  defaultLocale: defaultLanguage,
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

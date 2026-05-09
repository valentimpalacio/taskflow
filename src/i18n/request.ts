import { getRequestConfig } from 'next-intl/server';
import { languages, defaultLanguage } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Read the locale from the URL segment (set by the middleware).
  // Falls back to the default language if the locale is absent or invalid.
  const requested = await requestLocale;
  const locale =
    requested && languages.includes(requested as (typeof languages)[number])
      ? (requested as (typeof languages)[number])
      : defaultLanguage;

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return { locale, messages };
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale: ${locale}`, error);
    const messages = (await import(`./messages/${defaultLanguage}.json`)).default;
    return { locale: defaultLanguage, messages };
  }
});

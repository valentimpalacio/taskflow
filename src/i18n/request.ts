import { getRequestConfig } from 'next-intl/server';
import { languages, defaultLanguage } from './config';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = (locale || defaultLanguage) as string;
  
  // Validate that the incoming locale is valid
  if (!languages.includes(currentLocale as any)) {
    console.error(`Invalid locale: ${currentLocale}`);
  }

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  };
});

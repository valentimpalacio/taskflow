export const languages = ['pt', 'en', 'es'] as const;
export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'pt';

export const languageNames: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

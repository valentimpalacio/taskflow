import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { languages, Language, defaultLanguage } from '@/i18n/config';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { SessionProvider } from '@/components/SessionProvider';
import QueryProvider from '@/components/QueryProvider';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: {
      default: 'TaskFlow — Modern Task Management',
      template: '%s | TaskFlow',
    },
    description:
      'A full-stack task management application built with Next.js 16, TypeScript, Prisma 7, and Tailwind CSS 4. Features kanban board with drag-and-drop, dark mode, i18n, productivity analytics, and more.',
    keywords: [
      'task management',
      'project management',
      'kanban',
      'next.js',
      'typescript',
      'prisma',
      'tailwind css',
      'productivity',
    ],
    authors: [{ name: 'TaskFlow' }],
    openGraph: {
      title: 'TaskFlow — Modern Task Management',
      description:
        'A full-stack task management application with kanban board, dark mode, and productivity analytics.',
      type: 'website',
      locale: 'en_US',
      siteName: 'TaskFlow',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TaskFlow — Modern Task Management',
      description:
        'A full-stack task management application with kanban board, dark mode, and productivity analytics.',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  console.log(`[layout] Rendering for locale segment: ${locale}`);

  // Validate locale before anything else
  if (!languages.includes(locale as Language)) {
    notFound();
  }

  setRequestLocale(locale);

  // Load messages directly from the JSON file — avoids any requestLocale
  // timing issues that can occur when using getMessages() indirectly.
  const validLocale = locale as Language;
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`@/i18n/messages/${validLocale}.json`)).default;
  } catch {
    messages = (await import(`@/i18n/messages/${defaultLanguage}.json`)).default;
  }

  return (
    <html lang={validLocale}>
      <body>
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <QueryProvider>
            <SessionProvider>{children}</SessionProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
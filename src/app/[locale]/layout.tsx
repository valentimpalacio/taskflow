import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { notFound } from 'next/navigation';
import { languages } from '@/i18n/config';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fontVars = geistSans.variable + ' ' + geistMono.variable;

export async function generateStaticParams() {
  return languages.map((lang) => ({ locale: lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: 'TaskFlow - Modern Task Management',
    description:
      'A full-stack task management application built with Next.js, TypeScript, Prisma, and Tailwind CSS. Features kanban board, dark mode, and more.',
    keywords: [
      'task management',
      'project management',
      'kanban',
      'next.js',
      'typescript',
    ],
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

  if (!languages.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontVars} antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

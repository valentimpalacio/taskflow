import './globals.css';
import type { ReactNode } from 'react';
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
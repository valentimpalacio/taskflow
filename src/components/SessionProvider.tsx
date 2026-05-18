"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // `refetchInterval` keeps the session alive across client-side navigations
  // (e.g. locale switches) so the status never briefly drops to
  // "unauthenticated" while the new page mounts.
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </NextAuthSessionProvider>
  );
}
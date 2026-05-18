import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

interface UserSession {
  id: string;
  email: string;
  name: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: (() => {
    const providers: NextAuthOptions['providers'] = [
      CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        } as UserSession;
      },
    }),
    ];

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const hasGoogleConfig =
      !!clientId &&
      !!clientSecret &&
      clientId !== 'your-google-client-id' &&
      clientSecret !== 'your-google-client-secret';

    // Keep Google auth optional so credentials login works in environments
    // where OAuth secrets are not configured (e.g., screenshots/demo setup).
    if (hasGoogleConfig) {
      providers.push(
        GoogleProvider({
          clientId,
          clientSecret,
        })
      );
    }

    return providers;
  })(),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: { signIn: '/pt/auth/signin' },
};

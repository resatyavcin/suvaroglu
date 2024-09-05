'use server';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      return user.email === process.env.NEXT_PUBLIC_SUVAROGLU_EMAIL;
    },
    async redirect() {
      return process.env.NEXT_PUBLIC_CLIENT_URL || '';
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

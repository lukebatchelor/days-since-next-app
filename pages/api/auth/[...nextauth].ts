import NextAuth, { User } from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Session } from 'inspector';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: (session, user) => {
      const { name, email, image, id } = user as User & { id: string };
      return { ...session, user: { name, email, image, id } };
    },
  },
});

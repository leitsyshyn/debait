import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { v4 as _uuid } from "uuid";
import {} from "next-auth/jwt";
import authConfig from "@/lib/auth.config";
import { UserRole } from "@prisma/client";
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    username?: string;
  }
}

declare module "next-auth" {
  interface User {
    role?: UserRole;
    username?: string;
  }
  interface Session {
    user: {
      role?: UserRole;
      username?: string;
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(db);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser?.emailVerified) return false;

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique(
          {
            where: { userId: existingUser.id },
          }
        );
        if (!twoFactorConfirmation) return false;
        await db.twoFactorConfirmation.delete({
          where: { userId: existingUser.id },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      // if (!token?.sub) return token;
      // const existingUser = await prisma.user.findUnique({
      //   where: { id: token.sub },
      // });
      // token.role = existingUser?.role;
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token?.role && session.user) {
        session.user.role = token.role;
      }
      if (token?.username && session.user) {
        session.user.username = token.username;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
});

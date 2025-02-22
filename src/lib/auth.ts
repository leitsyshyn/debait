import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { v4 as _uuid } from "uuid";
import {} from "next-auth/jwt";
import authConfig from "@/lib/auth.config";
import { UserRole } from "@prisma/client";
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(prisma);

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
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!existingUser?.emailVerified) return false;

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation =
          await prisma.twoFactorConfirmation.findUnique({
            where: { userId: existingUser.id },
          });
        if (!twoFactorConfirmation) return false;
        await prisma.twoFactorConfirmation.delete({
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
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      // if (token?.sub && session.user) {
      //   session.user.id = token.sub;
      // }
      // if (token?.role && session.user) {
      //   session.user.role = token.role;
      // }
      session.user.role = token.role;
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
});

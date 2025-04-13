import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { v4 as _uuid } from "uuid";
import { Plan, UserRole } from "@prisma/client";

import { db } from "@/lib/prisma";
import {} from "next-auth/jwt";
import authConfig from "@/lib/auth.config";

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    role: UserRole;
    plan: Plan;
  }
}

declare module "next-auth" {
  interface User {
    username: string;
    role: UserRole;
    plan: Plan;
  }
  interface Session {
    user: {
      username: string;
      role: UserRole;
      plan: Plan;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    username: string;
    role: UserRole;
    plan: Plan;
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
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        token.name = session.name;
        token.username = session.username;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
          plan: user.plan,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: token.username,
          role: token.role,
          plan: token.plan,
        },
      };
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

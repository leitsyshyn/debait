import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: {
    strategy: "database",
  },
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const validatedCredentials = await signInSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findFirst({
            where: {
              email: validatedCredentials.email,
            },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            validatedCredentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            return null;
          }

          const { hashedPassword: _, ...userWithoutPassword } = user;

          return userWithoutPassword;
        } catch (error) {
          console.error("Error authorizing credentials:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const validatedCredentials = await loginSchema.parseAsync(
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
} satisfies NextAuthConfig;

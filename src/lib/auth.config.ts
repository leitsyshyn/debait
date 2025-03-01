import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import { loginSchema } from "@/features/auth/lib/schemas";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
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

          const user = await db.user.findFirst({
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

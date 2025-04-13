"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { EmailVerificationTokenPurpose } from "@prisma/client";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { loginSchema } from "@/features/auth/lib/schemas";
import { signIn } from "@/lib/auth";
import {
  sendVerificationEmail,
  sendTwoFactorEmail,
} from "@/features/auth/lib/mail";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
} from "@/features/auth/actions/tokens";

export const login = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const validatedCredentials = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    secret: formData.get("secret") || undefined,
  });

  if (!validatedCredentials.success) {
    console.log(validatedCredentials.error.issues);
    return {
      error: "Wrong password or email validation",
    };
  }

  const { email, password, secret } = validatedCredentials.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser && !existingUser.emailVerified) {
    sendVerificationEmail(
      email,
      await generateEmailVerificationToken(
        email,
        EmailVerificationTokenPurpose.REGISTER
      )
    );
    return {
      error: "Please verify your email",
    };
  }

  if (existingUser?.isTwoFactorEnabled) {
    if (secret) {
      const twoFactorToken = await db.twoFactorToken.findFirst({
        where: {
          email: existingUser.email,
          token: secret,
          expires: {
            gte: new Date(),
          },
        },
      });

      if (!twoFactorToken) {
        return {
          error: "Invalid 2FA token",
        };
      }

      await db.twoFactorToken.deleteMany({
        where: {
          email: existingUser.email,
        },
      });

      await db.twoFactorConfirmation.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      if (!existingUser.hashedPassword) {
        return {
          error: "Wrong password or email",
        };
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );

      if (!isPasswordValid) {
        return {
          error: "Wrong password or email",
        };
      }

      const twoFactorToken = await generateTwoFactorToken(email);
      sendTwoFactorEmail(email, twoFactorToken);
      return {
        error: "TwoFactorRequired",
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Wrong password or email",
          };
        default:
          return {
            error: "An error occurred",
          };
      }
    }
    throw error;
  }
};

"use server";

import bcrypt from "bcryptjs";
import { EmailVerificationTokenPurpose } from "@prisma/client";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { registerSchema } from "@/features/auth/lib/schemas";
import { sendVerificationEmail } from "@/features/auth/lib/mail";
import { generateEmailVerificationToken } from "@/features/auth/actions/tokens";

export const register = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const validatedCredentials = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!validatedCredentials.success) {
    return {
      error: "Invalid credentials",
    };
  }

  const { name, username, email, password } = validatedCredentials.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  const existingUsername = await db.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    return {
      error: "Username already exists",
    };
  }

  await db.user.create({
    data: {
      name,
      username,
      email,
      hashedPassword,
    },
  });

  const verificationToken = await generateEmailVerificationToken(
    email,
    EmailVerificationTokenPurpose.REGISTER
  );

  await sendVerificationEmail(email, verificationToken);

  if (process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION) {
    return {
      success: "We have sent you an email to verify your account",
    };
  }
};

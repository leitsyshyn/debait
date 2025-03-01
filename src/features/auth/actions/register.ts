"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { FormStatus } from "@/features/auth/lib/types";
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
  });

  if (!validatedCredentials.success) {
    return {
      error: "Invalid credentials",
    };
  }

  const { name, email, password } = validatedCredentials.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  await db.user.create({
    data: {
      name,
      username: email.split("@")[0].replace(/\./g, ""),
      email,
      hashedPassword,
    },
  });

  const verificationToken = await generateEmailVerificationToken(email);

  await sendVerificationEmail(email, verificationToken);

  if (process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION) {
    return {
      success: "We have sent you an email to verify your account",
    };
  }
};

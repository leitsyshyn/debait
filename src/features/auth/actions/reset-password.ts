"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { resetPasswordSchema } from "@/features/auth/lib/schemas";

export const resetPassword = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const validatedCredentials = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    token: formData.get("token"),
  });

  if (!validatedCredentials.success) {
    console.log(validatedCredentials.error.issues);
    return {
      error: "Invalid token",
    };
  }

  const { token, password } = validatedCredentials.data;

  console.log(token);

  const existingToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return {
      error: "Invalid token",
    };
  }

  const hasExpired = existingToken
    ? new Date() > new Date(existingToken.expires)
    : true;

  if (hasExpired) {
    return {
      error: "Token has expired",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { email: existingToken.email },
    data: {
      hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: { token },
  });

  return {
    success: "Password reset",
  };
};

"use server";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/features/auth/lib/types";
import { verifyEmailSchema } from "@/features/auth/lib/schemas";

export const verifyEmail = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const validatedToken = verifyEmailSchema.safeParse({
    token: formData.get("token"),
  });

  if (!validatedToken.success) {
    return {
      error: "Invalid token",
    };
  }
  const token = validatedToken.data.token;

  const existingToken = await db.emailVerificationToken.findUnique({
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

  await db.user.update({
    where: { email: existingToken.email },
    data: {
      email: existingToken.email,
      emailVerified: new Date(),
    },
  });

  await db.emailVerificationToken.delete({
    where: { token },
  });

  return {
    success: "Email verified",
  };
};

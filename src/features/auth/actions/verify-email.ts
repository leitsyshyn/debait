"use server";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { verifyEmailSchema } from "@/features/auth/lib/schemas";
import { auth } from "@/lib/auth";

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

  const existingToken = await db.token.findUnique({
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

  if (existingToken.type === "REGISTER_EMAIL_VERIFICATION") {
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
  }

  if (existingToken.type === "UPDATE_EMAIL_VERIFICATION") {
    const session = await auth();
    const userId = session?.user.id;
    await db.user.update({
      where: { id: userId },
      data: {
        email: existingToken.email,
      },
    });
  }

  await db.token.delete({
    where: { token },
  });

  return {
    success: "Email verified",
  };
};

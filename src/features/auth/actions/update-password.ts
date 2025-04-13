"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { updatePasswordSchema } from "@/features/auth/lib/schemas";
import { auth } from "@/lib/auth";

export const updatePassword = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const validatedCredentials = updatePasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedCredentials.success) {
    console.log(validatedCredentials.error.issues);
    return {
      error: "Invalid password",
    };
  }

  const { password } = validatedCredentials.data;

  const session = await auth();

  const userId = session?.user.id;
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return {
      error: "User not found",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: userId },
    data: {
      hashedPassword,
    },
  });

  return {
    success: "Password reset",
  };
};

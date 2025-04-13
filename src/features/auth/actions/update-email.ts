"use server";

import { EmailVerificationTokenPurpose } from "@prisma/client";

import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { updateEmailSchema } from "@/features/auth/lib/schemas";
import { sendVerificationEmail } from "@/features/auth/lib/mail";
import { generateEmailVerificationToken } from "@/features/auth/actions/tokens";
import { auth } from "@/lib/auth";

export const updateEmail = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const session = await auth();
  console.log("updateEmail: ", formData.get("email"));

  const userId = session?.user.id;
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedCredentials = updateEmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedCredentials.success) {
    return {
      error: "Invalid email",
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

  const { email } = validatedCredentials.data;

  const existingEmail = await db.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return {
      error: "Email already in use",
    };
  }

  const verificationToken = await generateEmailVerificationToken(
    email,
    EmailVerificationTokenPurpose.UPDATE
  );

  await sendVerificationEmail(email, verificationToken);
  return {
    success: "We have sent you an email to verify your account",
  };
};

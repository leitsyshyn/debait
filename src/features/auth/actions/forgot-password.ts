"use server";
import { db } from "@/lib/prisma";
import { FormStatus } from "@/lib/types";
import { sendResetPasswordEmail } from "@/features/auth/lib/mail";
import { generatePasswordResetToken } from "@/features/auth/actions/tokens";

export const forgotPassword = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const email = formData.get("email") as string;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  const verificationToken = await generatePasswordResetToken(email);

  await sendResetPasswordEmail(email, verificationToken);

  return {
    success: "We have sent you an email to reset your password",
  };
};

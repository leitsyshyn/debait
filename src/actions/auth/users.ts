"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateTwoFactorToken,
} from "@/actions/auth/tokens";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendTwoFactorEmail,
} from "@/lib/mail";

type FormStatus = {
  error?: string;
  success?: string;
};

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

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && !existingUser.emailVerified) {
    sendVerificationEmail(email, await generateEmailVerificationToken(email));
    return {
      error: "Please verify your email",
    };
  }

  if (existingUser?.isTwoFactorEnabled) {
    if (secret) {
      const twoFactorToken = await prisma.twoFactorToken.findFirst({
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

      await prisma.twoFactorToken.deleteMany({
        where: {
          email: existingUser.email,
        },
      });

      await prisma.twoFactorConfirmation.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      await prisma.twoFactorConfirmation.create({
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

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  const verificationToken = await generateEmailVerificationToken(email);

  await sendVerificationEmail(email, verificationToken);

  return {
    success: "We have sent you an email to verify your account",
  };
};

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

  const existingToken = await prisma.emailVerificationToken.findUnique({
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

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  await prisma.user.update({
    where: { email: existingToken.email },
    data: {
      email: existingToken.email,
      emailVerified: new Date(),
    },
  });

  await prisma.emailVerificationToken.delete({
    where: { token },
  });

  return {
    success: "Email verified",
  };
};

export const forgotPassword = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const email = formData.get("email") as string;

  const existingUser = await prisma.user.findUnique({
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

  const existingToken = await prisma.passwordResetToken.findUnique({
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

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: existingToken.email },
    data: {
      hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { token },
  });

  return {
    success: "Password reset",
  };
};

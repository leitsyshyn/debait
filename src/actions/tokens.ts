import { prisma } from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export async function generateEmailVerificationToken(email: string) {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.emailVerificationToken.deleteMany({
    where: {
      email,
    },
  });

  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.passwordResetToken.deleteMany({
    where: {
      email,
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 5);

  await prisma.twoFactorToken.deleteMany({
    where: {
      email,
    },
  });

  await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

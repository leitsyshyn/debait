"use server";

import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/prisma";

export async function generateEmailVerificationToken(email: string) {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await db.emailVerificationToken.deleteMany({
    where: {
      email,
    },
  });

  await db.emailVerificationToken.create({
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

  await db.passwordResetToken.deleteMany({
    where: {
      email,
    },
  });

  await db.passwordResetToken.create({
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

  await db.twoFactorToken.deleteMany({
    where: {
      email,
    },
  });

  await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

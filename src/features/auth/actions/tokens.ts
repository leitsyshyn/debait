"use server";

import crypto from "crypto";

import { v4 as uuid } from "uuid";
import { TokenType } from "@prisma/client";

import { db } from "@/lib/prisma";

export async function generateEmailVerificationToken(
  email: string,
  type: TokenType
) {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await db.token.deleteMany({
    where: { email, type },
  });

  await db.token.create({
    data: { email, token, expires, type },
  });

  return token;
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await db.token.deleteMany({
    where: { email, type: TokenType.PASSWORD_RESET },
  });

  await db.token.create({
    data: { email, token, expires, type: TokenType.PASSWORD_RESET },
  });

  return token;
}

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

  await db.token.deleteMany({
    where: { email, type: TokenType.TWO_FACTOR },
  });

  await db.token.create({
    data: { email, token, expires, type: TokenType.TWO_FACTOR },
  });

  return token;
}

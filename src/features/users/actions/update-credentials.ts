"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { updateCredentialsSchema } from "@/features/users/lib/schemas";

export async function editProfile(
  values: z.infer<typeof updateCredentialsSchema>
) {
  const validatedValues = updateCredentialsSchema.parse(values);

  const session = await auth();

  const user = session?.user;

  if (!user?.id) throw new Error("Unauthorized");

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) throw new Error("User not found");

  const existingEmail = await db.user.findUnique({
    where: { email: validatedValues.email },
  });

  if (existingEmail && existingEmail.id !== user.id) {
    throw new Error("Username already exists");
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}

"use server";

import { createPostSchema } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type FormStatus = {
  error?: string;
  success?: string;
};

export const submitPost = async (
  _previousState: FormStatus | null | undefined,
  formData: FormData
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const validationResult = createPostSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validationResult.success) {
    console.error(validationResult.error.issues);
    return { error: "Content is required" };
  }

  const { content } = validationResult.data;

  try {
    await prisma.post.create({
      data: {
        content,
        userId: session.user.id,
      },
    });

    return { success: "Post created" };
  } catch {
    return { error: "Failed to create post" };
  }
};

"use server";

import { createPostSchema } from "@/lib/schemas";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

type FormStatus = {
  error?: string;
  success?: string;
};

export const submitPostFromForm = async (
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

export const submitPost = async (input: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: session.user.id,
    },
    include: PostDataInclude,
  });

  return newPost;
};

export const deletePost = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: PostDataInclude,
  });

  return deletedPost;
};

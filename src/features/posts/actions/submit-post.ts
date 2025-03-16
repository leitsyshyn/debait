"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/features/posts/lib/schemas";

export const submitPost = async (input: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await db.post.create({
    data: {
      content,
      userId: session.user.id,
    },
    include: getPostDataInclude(session.user.id),
  });

  return newPost;
};

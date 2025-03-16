"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPostDataInclude } from "@/lib/types";

export const deletePost = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const deletedPost = await db.post.delete({
    where: { id },
    include: getPostDataInclude(session.user.id),
  });

  return deletedPost;
};

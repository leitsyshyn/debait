"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCommentDataInclude } from "@/lib/types";

export const deleteComment = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const comment = await db.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const deletedComment = await db.comment.delete({
    where: { id },
    include: getCommentDataInclude(session.user.id),
  });

  return deletedComment;
};

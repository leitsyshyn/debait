"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/features/posts/lib/schemas";
import { PostData } from "@/lib/types";

export const submitComment = async ({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { content: validatedContent } = createCommentSchema.parse({ content });

  const newComment = await db.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: session.user.id,
    },
    include: getCommentDataInclude(session.user.id),
  });

  return newComment;
};

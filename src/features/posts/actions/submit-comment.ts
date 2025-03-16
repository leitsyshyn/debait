"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCommentDataInclude, PostDataWithVotes } from "@/lib/types";
import { createCommentSchema } from "@/features/posts/lib/schemas";
import { PostData } from "@/lib/types";

export const submitComment = async ({
  post,
  content,
}: {
  post: PostDataWithVotes;
  content: string;
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { content: validatedContent } = createCommentSchema.parse({ content });

  const commentType =
    post.userVote == 1 ? "SUPPORT" : post.userVote == -1 ? "OPPOSE" : "CLARIFY";

  const newComment = await db.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: session.user.id,
      type: commentType,
    },
    include: getCommentDataInclude(session.user.id),
  });

  return newComment;
};

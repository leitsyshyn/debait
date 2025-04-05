"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCommentDataInclude, PostDataWithVotes } from "@/lib/types";
import { createCommentSchema } from "@/features/posts/comments/lib/schemas";

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

  console.log("commentType", commentType);

  const newComment = await db.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: session.user.id,
      type: commentType,
    },
    include: getCommentDataInclude(session.user.id),
  });

  return {
    ...newComment,
    upvotes: 0,
    downvotes: 0,
    userVote: null,
  };
};

import { NextResponse, NextRequest } from "next/server";
import { CommentType } from "@prisma/client";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getCommentDataInclude, CommentsPage } from "@/lib/types";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const type = req.nextUrl.searchParams.get("type") as
      | CommentType
      | undefined;

    const pageSize = 5;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await db.comment.findMany({
      where: {
        postId,
        ...(type && { type }),
      },
      include: getCommentDataInclude(session.user.id),
      // orderBy:
      //   sortBy === "new"
      //     ? { createdAt: "desc" }
      //     : { votes: { _count: "desc" } },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      // ...(cursor ? { skip: 1 } : {}),
    });

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const commentsWithVoteCounts = comments.map((comment) => {
      const upvotes = comment.votes.filter((v) => v.value === 1).length;
      const downvotes = comment.votes.filter((v) => v.value === -1).length;
      const userVote =
        comment.votes.find((v) => v.userId === session.user.id)?.value || null;

      return {
        ...comment,
        upvotes,
        downvotes,
        userVote,
      };
    });

    const data: CommentsPage = {
      comments: commentsWithVoteCounts.slice(0, pageSize),
      nextCursor,
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

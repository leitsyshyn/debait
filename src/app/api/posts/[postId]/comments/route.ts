import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getCommentDataInclude, CommentsPage } from "@/lib/types";

export async function GET(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  const { postId } = await context.params;
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await db.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(session.user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const data: CommentsPage = {
      comments: comments.slice(0, pageSize),
      nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

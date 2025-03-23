import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { CommentVoteData } from "@/lib/types";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ commentId: string }> }
) {
  const params = await props.params;

  const { commentId } = params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: {
        votes: {
          where: { userId: session.user.id },
          select: { userId: true, value: true },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const [upvotes, downvotes] = await Promise.all([
      db.commentVote.count({ where: { commentId, value: 1 } }),
      db.commentVote.count({ where: { commentId, value: -1 } }),
    ]);

    const data: CommentVoteData = {
      upvotes,
      downvotes,
      userVote: comment.votes.length ? comment.votes[0].value : null,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comment votes" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ commentId: string }> }
) {
  const params = await props.params;

  const { commentId } = params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await req.json();

    if (typeof value !== "number" || ![1, -1].includes(value)) {
      return NextResponse.json(
        { error: "Invalid vote value" },
        { status: 400 }
      );
    }

    await db.commentVote.upsert({
      where: { commentId_userId: { commentId, userId: session.user.id } },
      create: { commentId, userId: session.user.id, value },
      update: { value },
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comment votes" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ commentId: string }> }
) {
  const params = await props.params;

  const { commentId } = params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.commentVote.deleteMany({
      where: { commentId, userId: session.user.id },
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comment votes" },
      { status: 500 }
    );
  }
}

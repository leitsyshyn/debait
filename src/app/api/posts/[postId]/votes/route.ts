import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { VoteData } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        votes: {
          where: { userId: session.user.id },
          select: { userId: true, value: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const [upvotes, downvotes] = await Promise.all([
      db.vote.count({ where: { postId, value: 1 } }),
      db.vote.count({ where: { postId, value: -1 } }),
    ]);

    const data: VoteData = {
      upvotes,
      downvotes,
      userVote: post.votes.length ? post.votes[0].value : null,
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

export async function POST(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
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

    await db.vote.upsert({
      where: { postId_userId: { postId, userId: session.user.id } },
      create: { postId, userId: session.user.id, value },
      update: { value },
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.vote.deleteMany({
      where: { postId, userId: session.user.id },
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

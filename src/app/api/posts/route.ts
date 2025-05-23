import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause = {};

    if (req.nextUrl.searchParams.get("userId")) {
      whereClause = { userId: req.nextUrl.searchParams.get("userId") };
    } else if (req.nextUrl.searchParams.get("feed") === "following") {
      whereClause = {
        user: {
          followers: {
            some: {
              followerId: session.user.id,
            },
          },
        },
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      include: getPostDataInclude(session.user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const postsWithVoteCounts = posts.slice(0, pageSize).map((post) => {
      const upvotes = post.votes.filter((v) => v.value === 1).length;
      const downvotes = post.votes.filter((v) => v.value === -1).length;
      const userVote =
        post.votes.find((v) => v.userId === session.user.id)?.value || null;

      return {
        ...post,
        upvotes,
        downvotes,
        userVote,
      };
    });

    const data: PostsPage = {
      posts: postsWithVoteCounts,
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

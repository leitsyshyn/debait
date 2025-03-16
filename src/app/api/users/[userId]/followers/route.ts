import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { FollowData, getUserDataSelect } from "@/lib/types";
import { Follow } from "@prisma/client";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: getUserDataSelect(session.user.id),
    });

    if (!user) {
      return new Response("Not found", { status: 404 });
    }

    const data: FollowData = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.follow.upsert({
      where: {
        followerId_followindId: {
          followerId: session.user.id,
          followindId: userId,
        },
      },
      create: { followerId: session.user.id, followindId: userId },
      update: {},
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.follow.deleteMany({
      where: {
        followerId: session.user.id,
        followindId: userId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

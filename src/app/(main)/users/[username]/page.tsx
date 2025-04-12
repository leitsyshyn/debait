import { formatDate } from "date-fns";
import { BadgeCheck } from "lucide-react";
import { cache } from "react";

import { UserChart } from "@/features/users/components/user-chart";
import FollowerCount from "@/components/follows/follower-count";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/users/user-avatar";
import FollowButton from "@/components/follows/follow-button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import PostsFeed from "@/features/posts/components/posts-feed";

const getUser = cache(async (username: string, userId: string) => {
  const user = await db.user.findFirst({
    where: { username },
    select: getUserDataSelect(userId),
  });

  if (!user) {
    return null;
  }

  return user;
});

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const resolvedParams = await params;
  const user = await getUser(resolvedParams.username, session.user.id);

  if (!user) {
    return null;
  }

  const [supportCount, opposeCount, clarifyCount] = await Promise.all([
    db.comment.count({ where: { userId: user.id, type: "SUPPORT" } }),
    db.comment.count({ where: { userId: user.id, type: "OPPOSE" } }),
    db.comment.count({ where: { userId: user.id, type: "CLARIFY" } }),
  ]);

  return (
    <>
      <Card className="flex flex-row rounded-none shadow-none border-none border-b p-4 gap-8 items-end">
        <div className="flex flex-col gap-4">
          <UserAvatar
            className="size-36"
            username={user?.username ?? ""}
            image={user?.image ?? ""}
          />{" "}
          {session.user.id != user.id ? (
            <FollowButton
              userId={user?.id ?? ""}
              initialState={{
                followersCount: user._count.followers,
                isFollowedByUser: user.followers.some(
                  (follower) => follower.followerId === session.user.id
                ),
              }}
            />
          ) : (
            <Button variant="default" disabled>
              Edit profile
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-1 justify-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>{user?.name}</CardTitle>
              {user.plan === "PRO" && <BadgeCheck />}
            </div>

            <CardDescription>@{user?.username}</CardDescription>
          </div>
          <div>
            <div>
              <FollowerCount
                userId={user.id}
                initialData={{
                  followersCount: user._count.followers,
                  isFollowedByUser: user.followers.some(
                    (follower) => follower.followerId === session.user.id
                  ),
                }}
              />{" "}
              followers
            </div>
            <div>
              joined {formatDate(new Date(user.createdAt), "dd MMMM yyyy")}
            </div>
          </div>
        </div>

        <UserChart
          user={user}
          supportCount={supportCount}
          opposeCount={opposeCount}
          clarifyCount={clarifyCount}
        />
      </Card>
      <PostsFeed
        queryKey={["posts", "user-feed", user.id]}
        postsUrl={`/api/posts?userId=${user.id}`}
      />
    </>
  );
};

export default Page;

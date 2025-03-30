import { TestChart } from "@/components/charts/test-chart";
import FollowerCount from "@/components/follower-count";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserAvatar from "@/components/user/user-avatar";
import UserFeed from "@/features/posts/components/feed/user-feed";
import FollowButton from "@/features/users/components/follow-button";
import useFollowData from "@/hooks/use-follow-data";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatDate } from "date-fns";
import { BadgeCheck, User } from "lucide-react";
import { cache, use } from "react";

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
      {/* <div className="flex flex-1 min-h-svh flex-col  gap-6 bg-muted">
        <div className="flex w-full  flex-col"></div>
      </div> */}

      <div className="flex flex-1 min-h-svh flex-col">
        <div className="flex w-full flex-col">
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

            <TestChart
              user={user}
              supportCount={supportCount}
              opposeCount={opposeCount}
              clarifyCount={clarifyCount}
            />
          </Card>
          <UserFeed userId={user.id} />
        </div>
      </div>
    </>
  );
};

export default Page;

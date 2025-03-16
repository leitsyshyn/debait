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
import { User } from "lucide-react";
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

  return (
    <>
      {/* <div className="flex flex-1 min-h-svh flex-col  gap-6 bg-muted">
        <div className="flex w-full  flex-col"></div>
      </div> */}

      <div className="flex flex-1 min-h-svh flex-col">
        <div className="flex w-full flex-col">
          <Card className="flex flex-col rounded-none shadow-none border-none border-b p-4 gap-8 ">
            <UserAvatar
              className="size-36"
              username={user?.username ?? ""}
              image={user?.image ?? ""}
            />
            <div className="justify-between flex flex-row gap-4 items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>@{user?.username}</CardDescription>
              </div>
              {session.user.id != user.id ? (
                <FollowButton
                  userId={user?.id ?? ""}
                  initialState={{
                    followers: user._count.followers,
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
            <div>
              <div>
                <FollowerCount
                  userId={user.id}
                  initialData={{
                    followers: user._count.followers,
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
          </Card>
          <UserFeed userId={user.id} />
        </div>
      </div>
    </>
  );
};

export default Page;

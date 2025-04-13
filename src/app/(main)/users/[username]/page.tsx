import { formatDate } from "date-fns";
import { cache } from "react";
import { Radio, Users } from "lucide-react";

import { UserChart } from "@/features/users/components/user-chart";
import FollowerCount from "@/components/follows/follower-count";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import UserAvatar from "@/components/users/user-avatar";
import FollowButton from "@/components/follows/follow-button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import PostsFeed from "@/features/posts/components/posts-feed";
import EditProfileDialog from "@/features/users/components/edit-profile-dialog";
import UserPersona from "@/components/users/user-persona";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Following from "@/features/users/components/following";

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
      <Card className="flex flex-col rounded-none shadow-none border-none border-b p-4 gap-4">
        <div className="flex items-start gap-4 justify-between">
          <UserAvatar
            className="size-44"
            username={user?.username ?? ""}
            image={user?.image ?? ""}
          />
          <UserChart
            user={user}
            supportCount={supportCount}
            opposeCount={opposeCount}
            clarifyCount={clarifyCount}
          />
        </div>
        <div className="flex flex-col gap-1 justify-end">
          <div className="flex items-center justify-between gap-4">
            <UserPersona
              user={user}
              hasAvatar={false}
              isHoverable={false}
              dot={
                <CardDescription className="whitespace-nowrap leading-tight">
                  {" • joined "}
                  {formatDate(new Date(user.createdAt), "dd MMMM yyyy")}
                </CardDescription>
              }
            />
            {session.user.id != user.id ? (
              <FollowButton
                userId={user?.id ?? ""}
                initialData={{
                  followersCount: user._count.followers,
                  isFollowedByUser: user.followers.some(
                    (follower) => follower.followerId === session.user.id
                  ),
                }}
              />
            ) : (
              <EditProfileDialog user={user}>
                <Button variant="default">Edit profile</Button>
              </EditProfileDialog>
            )}
          </div>
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
          <div className="text-sm text-muted-foreground break-all">
            {user?.bio}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts" className="space-y-0">
        <TabsList className="flex gap-2 py-6 px-4 rounded-none border-y">
          <TabsTrigger value="posts" asChild className="flex-1">
            <Button variant="ghost">
              <Radio /> Posts
            </Button>
          </TabsTrigger>
          <TabsTrigger value="follows" asChild className="flex-1">
            <Button variant="ghost">
              <Users /> Follows
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostsFeed
            queryKey={["posts", "user-feed", user.id]}
            postsUrl={`/api/posts?userId=${user.id}`}
          />
        </TabsContent>
        <TabsContent value="follows">
          <Following userId={user.id} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;

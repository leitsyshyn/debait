import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import UserPersona from "@/components/users/user-persona";
import FollowButton from "@/components/follows/follow-button";

async function Following({ userId }: { userId: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
      followers: {
        some: {
          followerId: userId,
        },
      },
    },
    select: getUserDataSelect(session.user.id),
  });

  return (
    <div className="space-y-2 p-4">
      {usersToFollow.map((user) => (
        <div
          key={user.id}
          className="flex flex-row gap-2 items-center justify-between"
        >
          {user.username && (
            <>
              <UserPersona user={user} />
              <FollowButton
                userId={user.id}
                initialData={{
                  followersCount: user._count.followers,
                  isFollowedByUser: user.followers.some(
                    (follower) => follower.followerId === session.user.id
                  ),
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Following;

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

import FollowButton from "../follows/follow-button";
import UserPersona from "../users/user-persona";

async function WhoToFollow() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: session.user.id,
      },
      followers: {
        none: {
          followerId: session.user.id,
        },
      },
    },
    select: getUserDataSelect(session.user.id),
    take: 5,
  });

  return (
    <div className="space-y-2">
      {usersToFollow.map((user) => (
        <div
          key={user.id}
          className="flex flex-row gap-2 items-center justify-between"
        >
          {user.username && (
            <>
              <UserPersona
                user={{
                  ...user,
                  username: user.username || undefined,
                  plan: user.plan || undefined,
                }}
              />
              <FollowButton
                userId={user?.id ?? ""}
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

export default WhoToFollow;

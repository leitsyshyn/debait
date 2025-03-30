import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import TrendsSidebar from "./recomendations-sidebar";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { CardTitle, CardDescription } from "./ui/card";
import UserAvatar from "./user/user-avatar";
import UserLink from "./user/user-link";
import FollowButton from "@/features/users/components/follow-button";
import { Badge } from "./ui/badge";

export function AppSidebarRight() {
  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Who to follow</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <WhoToFollow />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Trending topics</SidebarGroupLabel>
          <SidebarGroupContent className="flex p-2 flex-row gap-2 flex-wrap">
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
            <Badge variant="secondary" className="mb-2">
              #some topic
            </Badge>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

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
              <UserLink username={user.username ?? ""}>
                <div className="flex items-center  gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar
                    image={user?.image ?? undefined}
                    className="size-8"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold hover:underline underline-offset-1">
                      {user?.name}
                    </span>
                    <span className="truncate  hover:underline underline-offset-1 text-xs text-muted-foreground">
                      @{user?.username}
                    </span>
                  </div>
                </div>
              </UserLink>
              <FollowButton
                userId={user.id}
                initialState={{
                  followersCount: user._count.followers,
                  isFollowedByUser: user.followers.some(({ followerId }) => {
                    return followerId === session.user.id;
                  }),
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

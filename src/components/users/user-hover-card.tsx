import { formatDate } from "date-fns";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserData } from "@/lib/types";

import FollowButton from "../follows/follow-button";
import FollowerCount from "../follows/follower-count";
import { CardDescription } from "../ui/card";

import UserPersona from "./user-persona";

type UserHoverCardProps = {
  user: UserData;
  children: React.ReactNode;
};

const UserHoverCard = ({ children, user }: UserHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2">
        <UserPersona user={user} isHoverable={false} />
        <CardDescription className="text-sm text-muted-foreground">
          joined {formatDate(new Date(user.createdAt), "dd MMMM yyyy")}
        </CardDescription>
        <div className="line-clamp-3">{user.bio}</div>
        <div className="space-x-1">
          <FollowerCount userId={user.id!} /> followers
        </div>

        {user.id && <FollowButton userId={user.id} />}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;

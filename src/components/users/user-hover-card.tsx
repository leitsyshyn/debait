import { User } from "next-auth";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import FollowButton from "../follows/follow-button";
import FollowerCount from "../follows/follower-count";

import UserPersona from "./user-persona";

type UserHoverCardProps = {
  user: User;
  children: React.ReactNode;
};

const UserHoverCard = ({ children, user }: UserHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2">
        <UserPersona user={user} isHoverable={false} />
        <div className="space-x-1">
          <FollowerCount userId={user.id!} />
          <span>followers</span>
        </div>
        {user.id && <FollowButton userId={user.id} />}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;

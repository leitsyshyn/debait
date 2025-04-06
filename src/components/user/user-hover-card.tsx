import { User } from "next-auth";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import FollowButton from "../follow-button";

import UserPersona from "./user-persona";

type UserHoverCardProps = {
  user: User;
  children: React.ReactNode;
};

const UserHoverCard = ({ children, user }: UserHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <UserPersona user={user} />
        {user.id && (
          <FollowButton
            userId={user.id}
            initialState={{ followersCount: 0, isFollowedByUser: false }}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;

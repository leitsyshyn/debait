"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";

import UserAvatar from "@/components/users/user-avatar";
import UserDisplayName from "@/components/users/user-display-name";
import UserUsername from "@/components/users/user-username";
import { UserData } from "@/lib/types";

import UserLink from "./user-link";
import UserHoverCard from "./user-hover-card";

interface WithCurrent {
  current: true;
}

interface WithUser {
  current?: boolean;
  user: User;
}

interface WithExplicit {
  current?: boolean;
  name: string;
  username: string;
  image?: string;
}

type UserPersonaProps = (WithCurrent | WithUser | WithExplicit) & {
  isHoverable?: boolean;
  hasAvatar?: boolean;
  dot?: React.ReactNode;
};

const UserPersona = (props: UserPersonaProps) => {
  const { isHoverable = true, hasAvatar = true, dot } = props;
  const { data: session } = useSession();
  const userData: Partial<User> = props.current
    ? session?.user ?? {}
    : "user" in props
    ? props.user
    : {
        name: props.name,
        username: props.username,
        image: props.image,
      };

  const { name, username, image } = userData;

  const perosna = (
    <div className="flex flex-row gap-2 items-center relative min-w-0">
      {hasAvatar && (
        <UserLink username={username}>
          <UserAvatar username={username} image={image ?? undefined} />
        </UserLink>
      )}
      <div className="flex flex-col min-w-0 gap-1">
        <div className="flex items-center gap-1 min-w-0 ">
          <UserLink username={username} className="min-w-0 ">
            <UserDisplayName>{name}</UserDisplayName>
          </UserLink>
          {dot}
        </div>
        <UserLink username={username}>
          <UserUsername>{username}</UserUsername>
        </UserLink>
      </div>
    </div>
  );

  if (isHoverable) {
    return <UserHoverCard user={userData as UserData}>{perosna}</UserHoverCard>;
  }

  return perosna;
};

export default UserPersona;

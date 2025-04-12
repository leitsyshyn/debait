"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";

import UserAvatar from "@/components/users/user-avatar";
import UserDisplayName from "@/components/users/user-display-name";
import UserUsername from "@/components/users/user-username";

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
};

const UserPersona = (props: UserPersonaProps) => {
  const { isHoverable = true } = props;
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
    <div className="flex flex-row gap-2 items-center w-48 relative">
      <UserLink username={username}>
        <UserAvatar username={username} image={image ?? undefined} />
      </UserLink>
      <div className="flex flex-col min-w-0 gap-1">
        <UserLink username={username}>
          <UserDisplayName>{name}</UserDisplayName>
        </UserLink>
        <UserLink username={username}>
          <UserUsername>{username}</UserUsername>
        </UserLink>
      </div>
    </div>
  );

  if (isHoverable) {
    return <UserHoverCard user={userData as User}>{perosna}</UserHoverCard>;
  }

  return perosna;
};

export default UserPersona;

import { User } from "next-auth";

import UserAvatar from "@/components/user/user-avatar";
import UserDisplayName from "@/components/user/user-display-name";
import UserUsername from "@/components/user/user-username";
import { auth } from "@/lib/auth";

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

type UserPersonaProps = WithCurrent | WithUser | WithExplicit;

const UserPersona = async (props: UserPersonaProps) => {
  const userData: Partial<User> = props.current
    ? await auth().then((session) => session?.user ?? {})
    : "user" in props
    ? props.user
    : {
        name: props.name,
        username: props.username,
        image: props.image,
      };

  const { name, username, image } = userData;

  return (
    <UserHoverCard user={userData}>
      <div className="flex flex-row gap-2 items-center">
        <UserLink username={username}>
          <UserAvatar username={username} image={image ?? undefined} />
        </UserLink>
        <div className="flex flex-col">
          <UserLink username={username}>
            <UserDisplayName>{name}</UserDisplayName>
          </UserLink>
          <UserLink username={username}>
            <UserUsername>{username}</UserUsername>
          </UserLink>
        </div>
      </div>
    </UserHoverCard>
  );
};

export default UserPersona;

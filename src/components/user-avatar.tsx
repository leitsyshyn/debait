import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { UserRound } from "lucide-react";
import Link from "next/link";

type UserAvatarProps = {
  image?: string;
  username?: string;
};

const UserAvatar = ({ image, username }: UserAvatarProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/users/${username}`}>
          <Avatar>
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <Link href={`/users/${username}`}>
            <a className="font-medium">{username}</a>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;

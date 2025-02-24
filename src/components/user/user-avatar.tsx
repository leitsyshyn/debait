import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

type UserAvatarProps = {
  image?: string;
  username?: string;
};

const UserAvatar = ({ image, username }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={image} alt={username} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

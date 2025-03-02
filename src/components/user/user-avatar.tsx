import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

type UserAvatarProps = {
  image?: string;
  username?: string;
  className?: string;
};

const UserAvatar = ({ image, username, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={image} alt={username} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

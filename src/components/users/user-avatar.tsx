import { User } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
        <User />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

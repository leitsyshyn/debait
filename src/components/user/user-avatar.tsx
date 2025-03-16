import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { User, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";

type UserAvatarProps = {
  current?: boolean;
  image?: string;
  username?: string;
  className?: string;
};

const UserAvatar = ({
  current,
  image,
  username,
  className,
}: UserAvatarProps) => {
  if (current) {
    const session = useSession();
    image = session?.data?.user?.image ?? undefined;
    username = session?.data?.user?.username ?? undefined;
  }
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={image ?? undefined} alt={username ?? undefined} />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

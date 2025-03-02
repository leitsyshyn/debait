import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserLink from "./user-link";
import UserAvatar from "./user-avatar";

type UserHoverCardProps = {
  image?: string;
  username: string;
  children: React.ReactNode;
  className?: string;
};

const UserHoverCard = ({ image, username, children }: UserHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-min">
        <div className="flex  gap-2">
          <UserAvatar image={image} username={username} />
          <UserLink username={username} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;

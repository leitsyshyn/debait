import { cn } from "@/lib/utils";
import Link from "next/link";

type UserLinkProps = {
  username: string;
  children?: React.ReactNode;
  className?: string;
};

const UserLink = ({ username, children, className }: UserLinkProps) => {
  return (
    <Link
      href={`/users/${username}`}
      className={cn(className, "[&>*]:hover:underline")}
    >
      {children || username}
    </Link>
  );
};

export default UserLink;

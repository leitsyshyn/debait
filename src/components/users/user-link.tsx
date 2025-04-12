import Link from "next/link";

import { cn } from "@/lib/utils";

type UserLinkProps = {
  username?: string;
  children?: React.ReactNode;
  className?: string;
};

const UserLink = ({ username, children, className }: UserLinkProps) => {
  return (
    <Link
      href={`/users/${username}`}
      className={cn(
        className,
        "[&>*]:hover:underline [&>*]:underline-offset-4"
      )}
    >
      {children ?? username}
    </Link>
  );
};

export default UserLink;

import Link from "next/link";

type UserLinkProps = {
  username: string;
  children?: React.ReactNode;
  className?: string;
};

const UserLink = ({ username, children, className }: UserLinkProps) => {
  return (
    <Link href={`/users/${username}`} className={className}>
      {children || username}
    </Link>
  );
};

export default UserLink;

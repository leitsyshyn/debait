const UserUsername = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-sm text-muted-foreground">@{children}</span>;
};

export default UserUsername;

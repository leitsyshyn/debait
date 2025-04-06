const UserUsername = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-gray-500">@{children}</span>;
};

export default UserUsername;

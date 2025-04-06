const UserDisplayName = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="font-semibold leading-none tracking-tight">
      {children}
    </span>
  );
};

export default UserDisplayName;

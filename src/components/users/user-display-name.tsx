const UserDisplayName = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="truncate font-semibold text-base leading-none tracking-tight">
      {children}
    </div>
  );
};

export default UserDisplayName;

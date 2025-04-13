const UserUsername = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children && (
        <div className="truncate text-sm text-muted-foreground leading-5">
          @{children}
        </div>
      )}
    </>
  );
};

export default UserUsername;

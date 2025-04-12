import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebarLeft from "@/components/app/app-sidebar-left";
import AppSidebarRight from "@/components/app/app-sidebar-right";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      defaultOpen={true}
    >
      <AppSidebarLeft />
      <div className="flex flex-1 min-h-svh flex-col relative">{children}</div>
      <AppSidebarRight />
    </SidebarProvider>
  );
};

export default MainLayout;

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarRight } from "@/components/app-sidebar-right";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {children}
      <AppSidebarRight />
    </SidebarProvider>
  );
}

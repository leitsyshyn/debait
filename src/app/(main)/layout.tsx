import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarLeft } from "@/components/app-sidebar-left";
import { AppSidebarRight } from "@/components/app-sidebar-right";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}

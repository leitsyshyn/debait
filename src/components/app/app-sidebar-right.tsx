import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import WhoToFollow from "./who-to-follow";
import TrendingTopics from "./trending-topics";

const AppSidebarRight = () => {
  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Who to follow</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <WhoToFollow />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Trending topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <TrendingTopics />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebarRight;

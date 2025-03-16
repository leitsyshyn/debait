import {
  CloudLightning,
  GalleryVerticalEnd,
  HeartHandshake,
  MessagesSquare,
  Radio,
  Swords,
  Users,
} from "lucide-react";
import ForYouFeed from "@/features/posts/components/feed/for-you-feed";
import LogoutButton from "@/features/auth/components/logout-button";
import CreatePostForm from "@/features/posts/components/post/create-post-form";
import { Button } from "@/components/ui/button";
import post from "@/features/posts/components/post/post";
import PostComments from "@/features/posts/components/post/post-comments";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FollowingFeed from "@/features/posts/components/feed/following-feed";
const Page = async () => {
  return (
    <div className="flex flex-1 min-h-svh flex-col">
      <div className="flex w-full flex-col relative">
        <CreatePostForm />
        <div>
          <Tabs defaultValue="for-you" className="space-y-0">
            <TabsList className="flex sticky top-0 z-10 gap-2 py-6 px-4 rounded-none border-y">
              <TabsTrigger value="for-you" asChild className="flex-1">
                <Button variant="ghost">
                  <Radio /> For you
                </Button>
              </TabsTrigger>
              <TabsTrigger value="following" asChild className="flex-1">
                <Button variant="ghost">
                  <Users /> Following
                </Button>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="for-you">
              <ForYouFeed />
            </TabsContent>
            <TabsContent value="following">
              <FollowingFeed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;

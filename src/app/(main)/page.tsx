import { Radio, Users } from "lucide-react";

import CreatePostForm from "@/features/posts/components/create-post-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostsFeed from "@/features/posts/components/posts-feed";

const Page = async () => {
  return (
    <>
      <CreatePostForm />
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
          <PostsFeed queryKey={["posts", "for-you"]} postsUrl="/api/posts" />
        </TabsContent>
        <TabsContent value="following">
          <PostsFeed
            queryKey={["posts", "following"]}
            postsUrl="/api/posts?feed=following"
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;

import { GalleryVerticalEnd } from "lucide-react";
import ForYouFeed from "@/features/posts/components/feed/for-you-feed";
import LogoutButton from "@/features/auth/components/logout-button";
import CreatePostForm from "@/features/posts/components/post/create-post-form";
const Page = async () => {
  return (
    <div className="flex flex-1 min-h-svh flex-col">
      <div className="flex w-full flex-col">
        <CreatePostForm />
        <ForYouFeed />
      </div>
    </div>
  );
};

export default Page;

import { GalleryVerticalEnd } from "lucide-react";
import ForYouFeed from "@/components/posts/for-you-feed";
import LogoutButton from "@/components/auth/logout-button";
import CreatePostForm from "@/components/posts/create-post-form";
const Page = async () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Debait.
        </a>
        <LogoutButton />
        <CreatePostForm />
        <ForYouFeed />
      </div>
    </div>
  );
};

export default Page;

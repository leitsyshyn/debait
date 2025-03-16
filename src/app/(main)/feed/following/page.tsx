import CreatePostForm from "@/features/posts/components/post/create-post-form";
import FollowingFeed from "@/features/posts/components/feed/following-feed";
const Page = async () => {
  return (
    <div className="flex flex-1 min-h-svh flex-col">
      <div className="flex w-full flex-col">
        <CreatePostForm />
        <FollowingFeed />
      </div>
    </div>
  );
};

export default Page;

import { GalleryVerticalEnd } from "lucide-react";
import { logout } from "@/actions/auth/users";
import { Button } from "@/components/ui/button";
import CreatePostForm from "@/components/posts/create-post-form";
import Feed from "@/components/posts/feed";
// import { auth } from "@/lib/auth";
const Page = async () => {
  // const session = await auth();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Debait.
        </a>
        <Button onClick={logout}>Sign out</Button>
        <CreatePostForm />
        <Feed />
        {/* {session && <div>Session: {JSON.stringify(session)}</div>} */}
      </div>
    </div>
  );
};

export default Page;

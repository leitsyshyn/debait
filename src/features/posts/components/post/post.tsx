import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import UserLink from "@/components/user/user-link";
import UserAvatar from "@/components/user/user-avatar";
import { Button } from "@/components/ui/button";
import PostMore from "./post-more-alert-dialog";
import { PostDataWithVotes } from "@/lib/types";
import { formatRelativeDate } from "@/features/posts/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MessagesSquare, Swords } from "lucide-react";
import { useState } from "react";
import PostDialog from "./post-dialog";
import { PostButtonDialog } from "./post-button-dialog";
import { VoteButton } from "./vote-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReadMore from "@/components/read-more";
import PostHeader from "./post-header";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

type PostProps = {
  post: PostDataWithVotes;
};

const Post = ({ post }: PostProps) => {
  // const editor = useEditor({
  //   content: post.content,
  //   editable: false,
  //   extensions: [StarterKit],
  // });

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="border-t">
      {/* <Link
        href={`/posts/${post.id}`}
        className="absolute inset-0 z-0"
        aria-label="Go to post"
      /> */}
      <div className="[&>*]:[&>*]:z-10 ">
        <PostHeader post={post} />
        <CardContent className="px-4 pb-0">
          <ReadMore text={post.content} lineClamp={3} />
          {/* <EditorContent editor={editor} /> */}
          {/* {post.content} */}
        </CardContent>
        <CardFooter className="px-4 pb-2 flex flex-row gap-2">
          <PostButtonDialog post={post} container={container}>
            <div className="flex flex-row gap-2">
              <div>
                <VoteButton
                  postId={post.id}
                  initialData={{
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    userVote: post.userVote,
                  }}
                  value={1}
                />
              </div>
              <div>
                <VoteButton
                  postId={post.id}
                  initialData={{
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    userVote: post.userVote,
                  }}
                  value={-1}
                />
              </div>
            </div>
          </PostButtonDialog>
          {/* <PostButtonDialog
            post={post}
            container={container}
          ></PostButtonDialog> */}

          <PostDialog post={post}>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost">
                      <MessagesSquare />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Comments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PostDialog>
        </CardFooter>
        <div ref={setContainer} />
      </div>
    </div>
  );
};

export default Post;

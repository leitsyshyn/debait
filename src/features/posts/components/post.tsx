import { MessagesSquare } from "lucide-react";
import { useState } from "react";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostDataWithVotes } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReadMore from "@/components/read-more";

import PostDialog from "./post-dialog";
import { PostButtonDialog } from "./post-button-dialog";
import { PostVoteButton } from "./post-vote-button";
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
      {/* <div className="[&>*]:[&>*]:z-10 "> */}
      <div className="flex flex-col gap-2">
        <PostHeader post={post} />

        <CardContent className="px-4 pb-0">
          <ReadMore>{post.content}</ReadMore>
        </CardContent>
        <CardFooter className="px-4 pb-2 flex flex-row gap-2">
          <PostButtonDialog post={post} container={container}>
            <div className="flex flex-row gap-2">
              <div>
                <PostVoteButton
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
                <PostVoteButton
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

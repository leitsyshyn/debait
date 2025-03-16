import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostDataWithVotes } from "@/lib/types";
import PostHeader from "./post-header";
import CreateCommentForm from "../comment/create-comment-form";
import PostComments from "./post-comments";
import {
  Cloud,
  CloudLightning,
  HeartHandshake,
  MessagesSquare,
  Swords,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoteButton } from "./vote-button";
import ReadMore from "@/components/read-more";

interface PostDialogProps {
  post: PostDataWithVotes;
  children?: React.ReactNode;
}

const PostDialog = ({ post, children }: PostDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent hideClose className="max-w-3xl p-0 gap-0">
        <DialogTitle className="hidden">
          Post by {post.user.name} created at {post.createdAt.toISOString()}
        </DialogTitle>
        <PostHeader post={post} />
        <div className="max-h-96 overflow-auto relative ">
          <div className="p-4 pt-0">
            <ReadMore lineClamp={3} text={post.content} />
          </div>
          <div>
            <Tabs defaultValue="all">
              <TabsList className="flex sticky top-0 z-10 gap-2 p-6 rounded-none border-y">
                <TabsTrigger value="all" asChild>
                  <Button variant="ghost">
                    <MessagesSquare /> All
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="support" asChild>
                  <Button variant="ghost">
                    <HeartHandshake /> Support
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="oppose" asChild>
                  <Button variant="ghost">
                    <Swords /> Oppose
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="clarify" asChild>
                  <Button variant="ghost">
                    <CloudLightning /> Clarify
                  </Button>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <PostComments post={post} />
              </TabsContent>
              <TabsContent value="support">
                <PostComments post={post} />
              </TabsContent>
              <TabsContent value="oppose">
                <PostComments post={post} />
              </TabsContent>
              <TabsContent value="clarify">
                <PostComments post={post} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="p-4 border-t flex flex-row gap-2">
          <VoteButton
            postId={post.id}
            initialData={{
              upvotes: post.upvotes,
              downvotes: post.downvotes,
              userVote: post.userVote,
            }}
            value={1}
          />
          <VoteButton
            postId={post.id}
            initialData={{
              upvotes: post.upvotes,
              downvotes: post.downvotes,
              userVote: post.userVote,
            }}
            value={-1}
          />

          <CreateCommentForm autoFocus={true} className=" flex-1" post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;

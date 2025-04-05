import {
  ChartArea,
  CloudLightning,
  HeartHandshake,
  MessagesSquare,
  Swords,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostDataWithVotes } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadMore from "@/components/read-more";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreateCommentForm from "../../comments/components/create-comment-form";

import PostHeader from "./post-header";
import PostComments from "./post-comments";
import { VoteButton } from "./vote-button";
import PostChart from "./post-chart";

interface PostDialogProps {
  post: PostDataWithVotes;
  children?: React.ReactNode;
}

const PostDialog = ({ post, children }: PostDialogProps) => {
  const [sortBy, setSortBy] = useState<"top" | "new">("new");
  const queryClient = useQueryClient();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent hideClose className="max-w-3xl p-0 gap-0">
        <DialogTitle className="hidden">
          Post by {post.user.name} created at {post.createdAt.toISOString()}
        </DialogTitle>
        <PostHeader post={post} />
        <div className="max-h-96 overflow-auto relative mt-4">
          <div className="p-4 pt-0">
            <ReadMore>{post.content}</ReadMore>
          </div>
          <div>
            <Tabs defaultValue="all">
              <TabsList className="flex sticky top-0 z-10 gap-2 p-6 rounded-none border-y">
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value as "top" | "new");
                    queryClient.invalidateQueries({
                      queryKey: ["comments", post.id],
                    });
                  }}
                >
                  <SelectTrigger className="bg-white w-fit max-w-[5rem]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                  </SelectContent>
                </Select>
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
                <TabsTrigger value="stats" asChild>
                  <Button variant="ghost">
                    <ChartArea /> Stats
                  </Button>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <PostComments post={post} sortBy={sortBy} />
              </TabsContent>
              <TabsContent value="support">
                <PostComments type="SUPPORT" post={post} sortBy={sortBy} />
              </TabsContent>
              <TabsContent value="oppose">
                <PostComments type="OPPOSE" post={post} sortBy={sortBy} />
              </TabsContent>
              <TabsContent value="clarify">
                <PostComments type="CLARIFY" post={post} sortBy={sortBy} />
              </TabsContent>
              <TabsContent value="stats">
                <PostChart votes={post.votes} />
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

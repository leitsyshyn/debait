import Link from "next/link";
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
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/features/posts/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, MessagesSquare, Swords } from "lucide-react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  // const editor = useEditor({
  //   content: post.content,
  //   editable: false,
  //   extensions: [StarterKit],
  // });
  return (
    <Card className="relative ">
      <Link
        href={`/posts/${post.id}`}
        className="absolute inset-0 z-0"
        aria-label="Go to post"
      />
      <div className="[&>*]:[&>*]:z-10 ">
        <div className="p-4 pb-0 flex flex-row gap-2 ">
          <UserAvatar
            className=""
            username={post.user.username ?? ""}
            image={post.user.image ?? ""}
          />
          <div className="min-w-0 flex flex-col flex-1 ">
            <div className="flex flex-row gap-2 items-baseline">
              <UserLink
                username={post.user.username ?? ""}
                className="min-w-0 "
              >
                <CardTitle className="truncate">{post.user.name}</CardTitle>
              </UserLink>
              <CardDescription>•</CardDescription>

              <CardDescription className="whitespace-nowrap hover:underline">
                {formatRelativeDate(post.createdAt)}
              </CardDescription>
            </div>
            <UserLink username={post.user.username ?? ""}>
              <CardDescription className=" ">
                @{post.user.username}
              </CardDescription>
            </UserLink>
          </div>
          <PostMore postId={post.id} userId={post.user.id} />
        </div>
        <div className="px-4 py-2 flex flex-row gap-2">
          <Badge variant="secondary">Politics</Badge>
          <Badge>Diplomacy</Badge>
          <Badge variant="outline">Ukraine</Badge>
        </div>
        <CardContent className="p-4 pt-0 pb-2">
          {/* <EditorContent editor={editor} /> */}
          {post.content}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-row gap-2">
          <Button variant="ghost" className="hover:text-red-500">
            <HeartHandshake />
          </Button>
          <Button variant="ghost" className="hover:text-blue-500">
            <Swords />
          </Button>
          <Button variant="ghost">
            <MessagesSquare />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default Post;

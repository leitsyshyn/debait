import { PostData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import UserLink from "../../users/components/user-link";
import UserAvatar from "../../users/components/user-avatar";
import Link from "next/link";
import MorePostOptions from "./delete-post-alert-dialog";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  return (
    <Card>
      <div className="flex flex-row p-4 gap-4 items-start">
        <UserLink username={post.user.username ?? ""}>
          <UserAvatar
            image={post.user.image ?? ""}
            username={post.user.username ?? ""}
          />
        </UserLink>
        <CardHeader className="p-0 w-full">
          <div className="flex flex-row items-baseline gap-2">
            <UserLink username={post.user.username ?? ""}>
              <CardTitle className="w-full hover:underline underline-offset-4 overflow-hidden text-ellipsis whitespace-nowrap">
                {post.user.name}
              </CardTitle>
            </UserLink>
            <CardDescription>{"•"}</CardDescription>
            <CardDescription>
              <Link href={`/posts/${post.id}`} className="hover:underline ">
                {formatRelativeDate(post.createdAt)}
              </Link>
            </CardDescription>
          </div>
          <UserLink username={post.user.username ?? ""}>
            <CardDescription>@{post.user.username}</CardDescription>
          </UserLink>
        </CardHeader>

        <MorePostOptions postId={post.id} userId={post.user.id} />
      </div>

      <CardContent className=" p-4 pt-0">{post.content}</CardContent>
    </Card>
  );
};

export default Post;

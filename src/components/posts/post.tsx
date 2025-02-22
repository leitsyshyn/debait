import { PostData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import UserAvatar from "../user-avatar";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  return (
    <Card>
      <div className="flex flex-row p-6 ">
        <UserAvatar
          image={post.user.image ?? ""}
          username={post.user.username ?? ""}
        />
        <CardHeader className="p-0">
          <Link
            href={`/users/${post.user.username}`}
            className="hover:underline underline-offset-4"
          >
            <CardTitle>{post.user.name}</CardTitle>{" "}
          </Link>
          <Link
            href={`/users/${post.user.username}`}
            className="hover:underline underline-offset-4"
          >
            <CardDescription>@{post.user.username}</CardDescription>
          </Link>
        </CardHeader>
      </div>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  );
};

export default Post;

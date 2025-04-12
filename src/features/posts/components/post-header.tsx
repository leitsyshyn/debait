import { CardDescription } from "@/components/ui/card";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import UserPersona from "@/components/users/user-persona";

import PostMore from "./post-more-alert-dialog";

const PostHeader = ({ post }: { post: PostData }) => {
  return (
    <div className="p-4 pb-0 flex flex-row gap-2 items-center ">
      <div className="flex flex-row gap-2 items-start flex-1">
        <UserPersona
          user={{
            ...post.user,
            username: post.user.username ?? undefined,
            plan: post.user.plan ?? undefined,
          }}
        />
        <CardDescription className="leading-tight">•</CardDescription>
        <CardDescription className="whitespace-nowrap leading-tight">
          {formatRelativeDate(post.createdAt)}
        </CardDescription>
      </div>
      <PostMore postId={post.id} userId={post.user.id} />
    </div>
  );
};

export default PostHeader;

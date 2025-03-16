import { CardDescription, CardTitle } from "@/components/ui/card";
import UserLink from "@/components/user/user-link";
import UserAvatar from "@/components/user/user-avatar";
import PostMore from "./post-more-alert-dialog";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/features/posts/lib/utils";
import { Badge } from "@/components/ui/badge";

const PostHeader = ({ post }: { post: PostData }) => {
  return (
    <>
      <div className="p-4 pb-0 flex flex-row gap-2 items-center ">
        <UserAvatar
          className=""
          username={post.user.username ?? ""}
          image={post.user.image ?? ""}
        />
        <div className="min-w-0 flex flex-col flex-1 ">
          <div className="flex flex-row gap-2 items-baseline">
            <UserLink username={post.user.username ?? ""} className="min-w-0 ">
              <CardTitle className="truncate leading-6">
                {post.user.name}
              </CardTitle>
            </UserLink>
            <CardDescription>•</CardDescription>

            <CardDescription className="whitespace-nowrap">
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
        <Badge>To do tags</Badge>
      </div>
    </>
  );
};

export default PostHeader;

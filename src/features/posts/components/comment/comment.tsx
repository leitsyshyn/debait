import { CommentData, CommentDataWithVotes } from "@/lib/types";
import CommentMore from "./comment-more-alert-dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CornerDownRight, HeartHandshake, Swords } from "lucide-react";
import UserLink from "@/components/user/user-link";
import UserAvatar from "@/components/user/user-avatar";
import { formatRelativeDate } from "../../lib/utils";
import ReadMore from "@/components/read-more";
import { CommentVoteButton } from "./comment-vote-button";

interface CommentProps {
  comment: CommentDataWithVotes;
}

const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex flex-row mt-4 px-4 gap-2 group">
      <UserAvatar
        className=""
        username={comment.user.username ?? ""}
        image={comment.user.image ?? ""}
      />
      <div className="min-w-0 flex flex-col flex-1 ">
        <div className="flex flex-row gap-2 items-center">
          <UserLink username={comment.user.username ?? ""} className="min-w-0 ">
            <CardTitle className="truncate">{comment.user.name}</CardTitle>
          </UserLink>
          {comment.type === "SUPPORT" ? (
            <HeartHandshake size="1rem" />
          ) : comment.type === "OPPOSE" ? (
            <Swords size="1rem" />
          ) : null}
          <CardDescription>•</CardDescription>

          <CardDescription className="whitespace-nowrap">
            {formatRelativeDate(comment.createdAt)}
          </CardDescription>
        </div>
        <ReadMore text={comment.content} lineClamp={3} />
        <div className="flex flex-row gap-2 mt-2">
          <CommentVoteButton
            postId={comment.postId}
            commentId={comment.id}
            initialData={{
              upvotes: comment.upvotes,
              downvotes: comment.downvotes,
              userVote: comment.userVote,
            }}
            value={1}
          />
          <CommentVoteButton
            postId={comment.postId}
            commentId={comment.id}
            initialData={{
              upvotes: comment.upvotes,
              downvotes: comment.downvotes,
              userVote: comment.userVote,
            }}
            value={-1}
          />
        </div>
      </div>
      <CommentMore
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        commentId={comment.id}
        userId={comment.user.id}
      />
    </div>
  );
};

export default Comment;

import { CardDescription } from "@/components/ui/card";
import { CommentDataWithVotes } from "@/lib/types";
import ReadMore from "@/components/read-more";
import { formatRelativeDate } from "@/lib/utils";
import UserPersona from "@/components/users/user-persona";

import CommentMore from "./comment-more-alert-dialog";
import { CommentVoteButton } from "./comment-vote-button";

interface CommentProps {
  comment: CommentDataWithVotes;
}

const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex flex-row mt-4 px-4 gap-2 group justify-between items-start">
      <div>
        <UserPersona
          user={comment.user}
          dot={
            <CardDescription className="whitespace-nowrap leading-tight">
              {" • "}
              {formatRelativeDate(comment.createdAt)}
            </CardDescription>
          }
        />
        <ReadMore>{comment.content}</ReadMore>
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

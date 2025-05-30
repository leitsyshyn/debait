import { QueryKey } from "@tanstack/react-query";

import { CommentVoteData } from "@/lib/types";
import { VoteButton } from "@/components/vote-button";

interface VoteButtonsProps {
  postId: string;
  commentId: string;
  initialData: CommentVoteData;
  value: number;
}

export const CommentVoteButton = ({
  postId,
  commentId,
  initialData,
  value,
}: VoteButtonsProps) => {
  const queryKey: QueryKey = ["commentVotes", postId, commentId];
  const voteUrl = `/api/posts/${postId}/comments/${commentId}/votes`;

  return (
    <VoteButton
      value={value}
      initialData={initialData}
      queryKey={queryKey}
      voteUrl={voteUrl}
    />
  );
};

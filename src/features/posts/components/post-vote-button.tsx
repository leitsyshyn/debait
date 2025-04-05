import { QueryKey } from "@tanstack/react-query";

import { VoteData } from "@/lib/types";
import { VoteButton } from "@/components/vote-button";

interface VoteButtonsProps {
  postId: string;
  initialData: VoteData;
  value: number;
}

export const PostVoteButton = ({
  postId,
  initialData,
  value,
}: VoteButtonsProps) => {
  const queryKey: QueryKey = ["posts", "votes", postId];
  const voteUrl = `/api/posts/${postId}/votes`;

  return (
    <VoteButton
      value={value}
      initialData={initialData}
      queryKey={queryKey}
      voteUrl={voteUrl}
    ></VoteButton>
  );
};

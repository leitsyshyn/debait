import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { CommentVoteData, VoteData } from "@/lib/types";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HeartHandshake, Swords } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["commentVotes", postId, commentId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/posts/${postId}/comments/${commentId}/votes`)
        .json<VoteData>(),
    initialData,
    staleTime: Infinity,
  });

  const voteMutation = useMutation({
    mutationFn: (voteValue: number) => {
      if (data.userVote === voteValue) {
        return kyInstance.delete(
          `/api/posts/${postId}/comments/${commentId}/votes`
        );
      }
      return kyInstance.post(
        `/api/posts/${postId}/comments/${commentId}/votes`,
        {
          json: { value: voteValue },
        }
      );
    },
    onMutate: async (voteValue: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<CommentVoteData>(queryKey);

      let newUpvotes = previousData?.upvotes || 0;
      let newDownvotes = previousData?.downvotes || 0;
      let newUserVote: number | null = voteValue;

      if (previousData?.userVote === voteValue) {
        newUserVote = null;
        if (voteValue === 1) newUpvotes -= 1;
        if (voteValue === -1) newDownvotes -= 1;
      } else if (previousData) {
        if (previousData.userVote === null) {
          if (voteValue === 1) newUpvotes += 1;
          if (voteValue === -1) newDownvotes += 1;
        } else if (previousData.userVote !== voteValue) {
          if (previousData.userVote === 1 && voteValue === -1) {
            newUpvotes -= 1;
            newDownvotes += 1;
          } else if (previousData.userVote === -1 && voteValue === 1) {
            newDownvotes -= 1;
            newUpvotes += 1;
          }
        }
      }

      queryClient.setQueryData<CommentVoteData>(queryKey, {
        userVote: newUserVote,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
      });

      return { previousData };
    },
    onError: (error, voteValue, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({
        queryKey: ["post-feed", "for-you", "following"],
      });
    },
  });

  return (
    <div>
      {value == 1 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => voteMutation.mutate(1)}
                className="group/button"
              >
                {data.userVote === 1 ? (
                  <HeartHandshake color="hsl(var(--support))" />
                ) : (
                  <HeartHandshake className="group-hover/button:text-[hsl(var(--support))]" />
                )}
                {data.upvotes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Support</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="group/button"
                variant="ghost"
                onClick={() => voteMutation.mutate(-1)}
              >
                {data.userVote === -1 ? (
                  <Swords color="hsl(var(--oppose))" />
                ) : (
                  <Swords className="group-hover/button:text-[hsl(var(--oppose))]" />
                )}
                {data.downvotes}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Oppose</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

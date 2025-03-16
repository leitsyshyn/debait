import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { VoteData } from "@/lib/types";

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
  initialData: VoteData;
  value: number;
}

export const VoteButton = ({
  postId,
  initialData,
  value,
}: VoteButtonsProps) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["votes", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/votes`).json<VoteData>(),
    initialData,
    staleTime: Infinity,
  });

  const voteMutation = useMutation({
    mutationFn: (voteValue: number) => {
      if (data.userVote === voteValue) {
        return kyInstance.delete(`/api/posts/${postId}/votes`);
      }
      return kyInstance.post(`/api/posts/${postId}/votes`, {
        json: { value: voteValue },
      });
    },
    onMutate: async (voteValue: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<VoteData>(queryKey);

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

      queryClient.setQueryData<VoteData>(queryKey, {
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
    },
  });

  return (
    <div>
      {value == 1 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => voteMutation.mutate(1)}>
                {data.userVote === 1 ? (
                  <HeartHandshake color="red" />
                ) : (
                  <HeartHandshake />
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
              <Button variant="ghost" onClick={() => voteMutation.mutate(-1)}>
                {data.userVote === -1 ? <Swords color="blue" /> : <Swords />}
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

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import kyInstance from "@/lib/ky";
import { VoteData } from "@/lib/types";

interface UseVoteOptions<T extends VoteData> {
  queryKey: QueryKey;
  voteUrl: string;
  initialData: T;
}

export const useVote = <T extends VoteData>({
  queryKey,
  voteUrl,
  initialData,
}: UseVoteOptions<T>) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<T>({
    queryKey,
    queryFn: () => kyInstance.get(voteUrl).json<T>(),
    initialData,
    staleTime: Infinity,
  });

  const voteMutation = useMutation({
    mutationFn: (voteValue: number) => {
      if (data?.userVote === voteValue) {
        return kyInstance.delete(voteUrl);
      }
      return kyInstance.post(voteUrl, { json: { value: voteValue } });
    },
    onMutate: async (voteValue: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T>(queryKey);

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

      queryClient.setQueryData<T>(queryKey, {
        userVote: newUserVote,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
      } as T);

      return { previousData };
    },
    onError: (
      _error,
      _voteValue,
      context: { previousData?: T } | undefined
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { data: data!, voteMutation };
};

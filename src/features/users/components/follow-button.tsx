"use client";

import { Button } from "@/components/ui/button";
import useFollowData from "@/hooks/use-follow-data";
import kyInstance from "@/lib/ky";
import { FollowData } from "@/lib/types";
import {
  Query,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export default function FollowButton({
  userId,
  initialState,
}: {
  userId: string;
  initialState: FollowData;
}) {
  const queryClient = useQueryClient();
  const { data } = useFollowData(userId, initialState);
  const queryKey: QueryKey = ["follower-data", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<FollowData>(queryKey);

      queryClient.setQueryData<FollowData>(queryKey, () => ({
        followers:
          (previousData?.followers || 0) +
          (previousData?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousData?.isFollowedByUser,
      }));

      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<FollowData>(queryKey, context?.previousData);
      console.error(err);
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}

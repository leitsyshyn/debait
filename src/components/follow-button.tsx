"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import useFollowData from "@/hooks/use-follow-data";
import kyInstance from "@/lib/ky";
import { FollowData } from "@/lib/types";

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
        followersCount:
          (previousData?.followersCount || 0) +
          (previousData?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousData?.isFollowedByUser,
      }));

      return { previousData };
    },
    onError: (context: { previousData?: FollowData }) => {
      queryClient.setQueryData<FollowData>(queryKey, context?.previousData);
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

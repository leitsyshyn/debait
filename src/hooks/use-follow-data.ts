import { useQuery } from "@tanstack/react-query";

import ky from "@/lib/ky";
import { FollowData } from "@/lib/types";

export default function useFollowData(
  userId: string,
  initialState: FollowData
) {
  const query = useQuery({
    queryKey: ["follower-data", userId],
    queryFn: () => ky.get(`/api/users/${userId}/followers`).json<FollowData>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}

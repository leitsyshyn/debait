import ky from "@/lib/ky";
import { FollowData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

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

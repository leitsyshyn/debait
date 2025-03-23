"use client";

import useFollowData from "@/hooks/use-follow-data";
import { FollowData } from "@/lib/types";

export default function FollowerCount({
  userId,
  initialData,
}: {
  userId: string;
  initialData: FollowData;
}) {
  const { data } = useFollowData(userId, initialData);

  return <span>{data.followersCount}</span>;
}

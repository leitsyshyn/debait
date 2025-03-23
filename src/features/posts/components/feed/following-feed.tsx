"use client";

import Post from "../post/post";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostsPage } from "@/lib/types";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FollowingFeed() {
  const router = useRouter();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following-feed",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending")
    return (
      <div className="flex items-center justify-center h-16">
        <Loader2 className="animate-spin m-auto" />
      </div>
    );
  if (status === "error") return <div>Error</div>;

  console.log(status);

  return (
    <InfiniteScrollContainer
      className="flex flex-col"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post}></Post>
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center h-16">
          <Loader2 className="animate-spin m-auto" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

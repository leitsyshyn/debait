"use client";

import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";

import Post from "./post";

interface PostsFeedProps {
  queryKey: QueryKey;
  postsUrl: string;
}
export default function PostsFeed({ queryKey, postsUrl }: PostsFeedProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(postsUrl, pageParam ? { searchParams: { cursor: pageParam } } : {})
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

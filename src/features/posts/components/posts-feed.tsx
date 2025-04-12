"use client";

import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";

import Post from "./post";
import PostSkeleton from "./post-skeleton";

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
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </>
    );
  if (status === "error")
    return (
      <div className="border-t flex justify-center items-center p-4 text-sm text-destructive">
        An error occurred while loading posts
      </div>
    );

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
        <div className="flex p-4 justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!hasNextPage && !isFetching && (
        <div className="border-t flex justify-center items-center p-4 text-sm text-muted-foreground">
          No more posts to load
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

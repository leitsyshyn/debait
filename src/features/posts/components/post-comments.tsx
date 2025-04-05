"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { CommentType } from "@prisma/client";

import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Comment from "@/features/posts/comments/components/comment";

interface PostCommentsProps {
  post: PostData;
  type?: CommentType | undefined;
  sortBy: "new" | "top";
}

export default function PostComments({
  post,
  type,
  sortBy,
}: PostCommentsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/comments?${type ? `type=${type}` : ""}${
            sortBy ? `&sortBy=${sortBy}` : ""
          }`,
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending")
    return (
      <div className="flex items-center justify-center h-16">
        <Loader2 className="animate-spin m-auto" />
      </div>
    );
  if (status === "error") return <div>Error</div>;

  return (
    <InfiniteScrollContainer
      className="flex flex-col pb-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <Comment comment={comment}></Comment>
          </div>
        ))
      ) : (
        <div className="mx-auto p-4 pb-0 h-12 text-center">No comments</div>
      )}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center h-16">
          <Loader2 className="animate-spin m-auto" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

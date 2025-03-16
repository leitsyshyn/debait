"use client";

import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CommentsPage, PostData } from "@/lib/types";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Comment from "../comment/comment";

interface PostCommentsProps {
  post: PostData;
}

export default function PostComments({ post }: PostCommentsProps) {
  const router = useRouter();
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
          `/api/posts/${[post.id]}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending") return <Loader2 className="animate-spin mx-auto" />;
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
        <div className="mx-auto p-4 pb-0 text-base">No comments</div>
      )}

      {isFetchingNextPage && <Loader2 className="animate-spin mx-auto" />}
    </InfiniteScrollContainer>
  );
}

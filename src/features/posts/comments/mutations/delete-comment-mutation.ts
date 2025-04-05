import { toast } from "sonner";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { CommentsPage } from "@/lib/types";
import { deleteComment } from "@/features/posts/comments/actions/delete-comment";

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id
              ),
            })),
          };
        }
      );

      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete comment. Please try again later.");
    },
  });

  return mutation;
}

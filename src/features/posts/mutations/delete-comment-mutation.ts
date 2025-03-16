import { toast } from "sonner";
import { CommentsPage, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment } from "@/features/posts/actions/delete-comment";

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
              previousCursor: page.previousCursor,
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

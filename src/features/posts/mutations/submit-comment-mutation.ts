import { toast } from "sonner";
import { CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitComment } from "@/features/posts/actions/submit-comment";

export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [newComment, ...firstPage.comments],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) => {
          return !query.state.data;
        },
      });

      toast.success("Comment submitted successfully");
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to submit comment. Please try again later.");
    },
  });

  return mutation;
}

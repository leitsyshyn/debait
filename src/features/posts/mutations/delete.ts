import { toast } from "sonner";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "@/features/posts/actions/delete";

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (deletedPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        { queryKey: ["post-feed"] };

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        }
      );

      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete post. Please try again later.");
    },
  });

  return mutation;
}

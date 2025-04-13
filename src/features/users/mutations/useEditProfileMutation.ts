import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { editProfile } from "@/features/users/actions/edit-profile";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";

import { editProfileSchema } from "../lib/schemas";

export function useEditProfileMutation() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: z.infer<typeof editProfileSchema>;
      avatar?: File;
    }) => {
      return Promise.all([
        editProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser]) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["posts"],
        };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData?.pages) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      // image: newAvatarUrl || updatedUser.image,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();
    },
    onError(error) {
      console.error(error);
    },
  });

  return mutation;
}

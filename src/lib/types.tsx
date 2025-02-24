import { Prisma } from "@prisma/client";

export const UserDataSelect = {
  id: true,
  username: true,
  name: true,
  image: true,
} satisfies Prisma.UserSelect;

export const PostDataInclude = {
  user: {
    select: UserDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof PostDataInclude;
}>;

export type PostsPage = {
  posts: PostData[];
  nextCursor: string | null;
};

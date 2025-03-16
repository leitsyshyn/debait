import { Prisma } from "@prisma/client";

export function getUserDataSelect(sessionUserId: string) {
  return {
    id: true,
    username: true,
    name: true,
    image: true,
    createdAt: true,
    followers: {
      where: { followerId: sessionUserId },
      select: { followerId: true },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(sessionUserId: string) {
  return {
    user: {
      select: getUserDataSelect(sessionUserId),
    },
    votes: {
      // where: { userId: sessionUserId },
      select: { userId: true, value: true },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

// export type PostsPage = {
//   posts: PostData[];
//   nextCursor: string | null;
// };

export type PostDataWithVotes = PostData & {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
};

// And update PostsPage accordingly:
export type PostsPage = {
  posts: PostDataWithVotes[];
  nextCursor: string | null;
};

export function getCommentDataInclude(sessionUserId: string) {
  return {
    user: {
      select: getUserDataSelect(sessionUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  nextCursor: string | null;
}

export interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
}

export interface FollowData {
  isFollowedByUser: boolean;
  followers: number;
}

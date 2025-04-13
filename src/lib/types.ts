import { Prisma } from "@prisma/client";

export function getUserDataSelect(sessionUserId: string) {
  return {
    id: true,
    username: true,
    name: true,
    image: true,
    createdAt: true,
    plan: true,
    role: true,
    bio: true,
    followers: {
      where: { followerId: sessionUserId },
      select: { followerId: true },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
        arguments: true,
        votes: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
export interface FollowData {
  isFollowedByUser: boolean;
  followersCount: number;
}

export function getPostDataInclude(sessionUserId: string) {
  return {
    user: {
      select: getUserDataSelect(sessionUserId),
    },
    votes: {
      select: { userId: true, value: true, createdAt: true },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PostDataWithVotes = PostData & {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
};

export type PostsPage = {
  posts: PostDataWithVotes[];
  nextCursor: string | null;
};

export function getCommentDataInclude(sessionUserId: string) {
  return {
    user: {
      select: getUserDataSelect(sessionUserId),
    },
    votes: {
      select: { userId: true, value: true },
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type CommentDataWithVotes = CommentData & {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
};
export interface CommentsPage {
  comments: CommentDataWithVotes[];
  nextCursor: string | null;
}
export interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
}
export interface CommentVoteData {
  upvotes: number;
  downvotes: number;
  userVote: number | null;
}

export type FormStatus = {
  error?: string;
  success?: string;
};

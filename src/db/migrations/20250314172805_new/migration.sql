/*
  Warnings:

  - Added the required column `type` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE', 'CLARIFY');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "type" "CommentType" NOT NULL;

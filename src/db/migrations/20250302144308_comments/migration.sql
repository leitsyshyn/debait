/*
  Warnings:

  - You are about to drop the column `argumentId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `Argument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostTopics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFollowedTopics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('SUPPORT', 'CRITIQUE');

-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_PostId_fkey";

-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_argumentId_fkey";

-- DropForeignKey
ALTER TABLE "_PostTopics" DROP CONSTRAINT "_PostTopics_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostTopics" DROP CONSTRAINT "_PostTopics_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollowedTopics" DROP CONSTRAINT "_UserFollowedTopics_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollowedTopics" DROP CONSTRAINT "_UserFollowedTopics_B_fkey";

-- DropIndex
DROP INDEX "Vote_userId_argumentId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "argumentId",
ADD COLUMN     "commentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Argument";

-- DropTable
DROP TABLE "Topic";

-- DropTable
DROP TABLE "_PostTopics";

-- DropTable
DROP TABLE "_UserFollowedTopics";

-- DropEnum
DROP TYPE "ArgumentType";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "PostId" TEXT NOT NULL,
    "type" "CommentType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserFollowedTags" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFollowedTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_PostTags_B_index" ON "_PostTags"("B");

-- CreateIndex
CREATE INDEX "_UserFollowedTags_B_index" ON "_UserFollowedTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_commentId_key" ON "Vote"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowedTags" ADD CONSTRAINT "_UserFollowedTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowedTags" ADD CONSTRAINT "_UserFollowedTags_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

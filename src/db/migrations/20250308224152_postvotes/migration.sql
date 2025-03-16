/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_userId_commentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_postId_key" ON "Vote"("userId", "postId");

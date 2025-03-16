/*
  Warnings:

  - Added the required column `postId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

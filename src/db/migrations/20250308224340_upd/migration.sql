/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_userId_postId_key";

-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_postId_userId_key" ON "Vote"("postId", "userId");

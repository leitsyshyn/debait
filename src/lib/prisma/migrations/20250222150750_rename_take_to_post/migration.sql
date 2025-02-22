/*
  Warnings:

  - You are about to drop the column `takeId` on the `Argument` table. All the data in the column will be lost.
  - You are about to drop the `Take` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TakeTopics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `PostId` to the `Argument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('OPEN', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_takeId_fkey";

-- DropForeignKey
ALTER TABLE "Take" DROP CONSTRAINT "Take_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_TakeTopics" DROP CONSTRAINT "_TakeTopics_A_fkey";

-- DropForeignKey
ALTER TABLE "_TakeTopics" DROP CONSTRAINT "_TakeTopics_B_fkey";

-- AlterTable
ALTER TABLE "Argument" DROP COLUMN "takeId",
ADD COLUMN     "PostId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Take";

-- DropTable
DROP TABLE "_TakeTopics";

-- DropEnum
DROP TYPE "TakeStatus";

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostTopics" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PostTopics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostTopics_B_index" ON "_PostTopics"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTopics" ADD CONSTRAINT "_PostTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTopics" ADD CONSTRAINT "_PostTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

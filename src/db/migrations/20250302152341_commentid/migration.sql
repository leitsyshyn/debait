/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "commentId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

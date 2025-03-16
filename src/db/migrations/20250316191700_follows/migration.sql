/*
  Warnings:

  - You are about to drop the column `type` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `value` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "type",
ADD COLUMN     "value" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "VoteType";

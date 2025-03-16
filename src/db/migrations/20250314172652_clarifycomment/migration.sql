/*
  Warnings:

  - The values [CRITIQUE] on the enum `CommentType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `value` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentType_new" AS ENUM ('SUPPORT', 'OPPOSE', 'CLARIFY');
ALTER TYPE "CommentType" RENAME TO "CommentType_old";
ALTER TYPE "CommentType_new" RENAME TO "CommentType";
DROP TYPE "CommentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "value" INTEGER NOT NULL;

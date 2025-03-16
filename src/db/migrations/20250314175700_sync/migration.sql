/*
  Warnings:

  - The values [UPVOTE,DOWNVOTE] on the enum `VoteType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoteType_new" AS ENUM ('SUPPORT', 'OPPOSE', 'CLARIFY');
ALTER TABLE "Vote" ALTER COLUMN "type" TYPE "VoteType_new" USING ("type"::text::"VoteType_new");
ALTER TYPE "VoteType" RENAME TO "VoteType_old";
ALTER TYPE "VoteType_new" RENAME TO "VoteType";
DROP TYPE "VoteType_old";
COMMIT;

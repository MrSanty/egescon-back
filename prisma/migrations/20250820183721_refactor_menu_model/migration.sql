/*
  Warnings:

  - You are about to drop the column `parentId` on the `Menu` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Menu_parentId_idx";

-- AlterTable
ALTER TABLE "public"."Menu" DROP COLUMN "parentId",
ADD COLUMN     "parent" TEXT;

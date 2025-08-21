/*
  Warnings:

  - A unique constraint covering the columns `[hashedRefreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hashedRefreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_hashedRefreshToken_key" ON "public"."User"("hashedRefreshToken");

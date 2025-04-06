/*
  Warnings:

  - You are about to drop the column `rulles` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "rulles",
ADD COLUMN     "rules" TEXT[];

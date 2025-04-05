/*
  Warnings:

  - Added the required column `description` to the `cups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `cups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cups" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "in_stock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

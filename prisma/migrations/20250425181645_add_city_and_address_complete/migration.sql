/*
  Warnings:

  - Added the required column `address_complete` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address_complete" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL;

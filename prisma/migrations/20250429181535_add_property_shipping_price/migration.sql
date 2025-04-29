/*
  Warnings:

  - Added the required column `shipping_price` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "shipping_price" DOUBLE PRECISION NOT NULL;

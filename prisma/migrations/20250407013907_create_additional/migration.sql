/*
  Warnings:

  - Added the required column `quantity_additional` to the `cups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cups" ADD COLUMN     "quantity_additional" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "additional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "additional_pkey" PRIMARY KEY ("id")
);

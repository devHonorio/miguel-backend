/*
  Warnings:

  - Added the required column `change` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('pix', 'credit', 'debit', 'cash');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "change" TEXT NOT NULL,
ADD COLUMN     "hour" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;

/*
  Warnings:

  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('rascunho', 'confirmar_pedido', 'anotado', 'cancelado');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_id" TEXT,
    "observations" TEXT,
    "discount" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order items" (
    "id" TEXT NOT NULL,
    "cup_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "order items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdditionalToOrderItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdditionalToOrderItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AdditionalToOrderItem_B_index" ON "_AdditionalToOrderItem"("B");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order items" ADD CONSTRAINT "order items_cup_id_fkey" FOREIGN KEY ("cup_id") REFERENCES "cups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order items" ADD CONSTRAINT "order items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdditionalToOrderItem" ADD CONSTRAINT "_AdditionalToOrderItem_A_fkey" FOREIGN KEY ("A") REFERENCES "additional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdditionalToOrderItem" ADD CONSTRAINT "_AdditionalToOrderItem_B_fkey" FOREIGN KEY ("B") REFERENCES "order items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

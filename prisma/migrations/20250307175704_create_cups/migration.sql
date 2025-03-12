-- CreateTable
CREATE TABLE "cups" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "cups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cups_size_key" ON "cups"("size");

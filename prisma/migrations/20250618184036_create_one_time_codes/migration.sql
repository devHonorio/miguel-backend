-- CreateTable
CREATE TABLE "one time codes" (
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "one time codes_pkey" PRIMARY KEY ("phone")
);

-- CreateIndex
CREATE UNIQUE INDEX "one time codes_phone_key" ON "one time codes"("phone");

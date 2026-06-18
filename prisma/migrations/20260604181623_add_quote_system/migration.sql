/*
  Warnings:

  - You are about to drop the column `quoteAmount` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('SENT', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "quoteAmount";

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "depositApplied" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "remainingBalance" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION,
    "estimatedDays" TEXT,
    "notes" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_orderId_key" ON "Quote"("orderId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

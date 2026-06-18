/*
  Warnings:

  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddress",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 25,
ADD COLUMN     "depositPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quoteAmount" DOUBLE PRECISION,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "isCategoryCover" BOOLEAN NOT NULL DEFAULT false;

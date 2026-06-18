/*
  Warnings:

  - Added the required column `fulfillmentType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('SHIPPING', 'PICKUP');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "fulfillmentType",
ADD COLUMN     "fulfillmentType" "FulfillmentType" NOT NULL;

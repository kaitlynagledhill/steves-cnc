/*
  Warnings:

  - You are about to drop the column `placementContext` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `sizeRequest` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `category` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `woodTypePreference` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "placementContext",
DROP COLUMN "sizeRequest",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "woodTypePreference" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

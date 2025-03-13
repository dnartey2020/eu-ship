/*
  Warnings:

  - You are about to drop the column `packageDescription` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `packageDimensions` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `packageQuantity` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `packageWeight` on the `Package` table. All the data in the column will be lost.
  - The `pickupTime` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `description` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "packageDescription",
DROP COLUMN "packageDimensions",
DROP COLUMN "packageQuantity",
DROP COLUMN "packageWeight",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "pickupTime",
ADD COLUMN     "pickupTime" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Shipment_trackingNumber_idx" ON "Shipment"("trackingNumber");

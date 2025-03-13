/*
  Warnings:

  - You are about to drop the column `pickupDate` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTime` on the `Shipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "pickupDate",
DROP COLUMN "pickupTime";

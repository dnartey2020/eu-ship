/*
  Warnings:

  - Made the column `pickupDate` on table `Shipment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "pickupDate" SET NOT NULL,
ALTER COLUMN "pickupTime" SET DATA TYPE TEXT;

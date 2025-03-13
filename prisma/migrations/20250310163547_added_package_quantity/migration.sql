/*
  Warnings:

  - Made the column `pickupTime` on table `Shipment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "pickupTime" SET NOT NULL;

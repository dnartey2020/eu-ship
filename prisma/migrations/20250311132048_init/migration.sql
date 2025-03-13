/*
  Warnings:

  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ShipmentStatus" ADD VALUE 'ON_HOLD';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "pickupTime" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_paid_idx" ON "Invoice"("paid");

-- CreateIndex
CREATE INDEX "Package_shipmentId_idx" ON "Package"("shipmentId");

-- CreateIndex
CREATE INDEX "Shipment_userId_idx" ON "Shipment"("userId");

-- CreateIndex
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "pickupDate" TIMESTAMP(3),
ADD COLUMN     "pickupTime" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

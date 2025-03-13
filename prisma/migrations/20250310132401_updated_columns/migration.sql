/*
  Warnings:

  - Made the column `packageDescription` on table `Package` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "packageQuantity" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "packageDescription" SET NOT NULL;

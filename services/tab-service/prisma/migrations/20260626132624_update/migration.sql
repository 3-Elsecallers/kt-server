/*
  Warnings:

  - You are about to drop the column `vat_rate` on the `tabs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tabs" DROP COLUMN "vat_rate",
ADD COLUMN     "vat_amount" DECIMAL(65,30);

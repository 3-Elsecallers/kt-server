-- AlterTable
ALTER TABLE "tab_items" ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "tabs" ADD COLUMN     "total_paid" DECIMAL(65,30),
ADD COLUMN     "vat_rate" DECIMAL(65,30);

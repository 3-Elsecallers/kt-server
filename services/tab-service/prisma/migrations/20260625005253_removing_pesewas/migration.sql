/*
  Warnings:

  - You are about to drop the column `total_price_pesewas` on the `tab_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price_pesewas` on the `tab_items` table. All the data in the column will be lost.
  - You are about to drop the column `pre_auth_amount_pesewas` on the `tabs` table. All the data in the column will be lost.
  - You are about to drop the column `running_total_pesewas` on the `tabs` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `tab_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `tab_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pre_auth_amount` to the `tabs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tab_items" DROP COLUMN "total_price_pesewas",
DROP COLUMN "unit_price_pesewas",
ADD COLUMN     "total_price" INTEGER NOT NULL,
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tabs" DROP COLUMN "pre_auth_amount_pesewas",
DROP COLUMN "running_total_pesewas",
ADD COLUMN     "pre_auth_amount" INTEGER NOT NULL,
ADD COLUMN     "running_total" INTEGER NOT NULL DEFAULT 0;

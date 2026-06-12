/*
  Warnings:

  - You are about to drop the column `authorizationAmount` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `latLng` on the `venues` table. All the data in the column will be lost.
  - Added the required column `authorization_amount` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat_lng` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venues" DROP COLUMN "authorizationAmount",
DROP COLUMN "latLng",
ADD COLUMN     "authorization_amount" INTEGER NOT NULL,
ADD COLUMN     "lat_lng" TEXT NOT NULL;

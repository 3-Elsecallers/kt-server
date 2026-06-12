/*
  Warnings:

  - Added the required column `authorizationAmount` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latLng` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "authorizationAmount" INTEGER NOT NULL,
ADD COLUMN     "latLng" TEXT NOT NULL;

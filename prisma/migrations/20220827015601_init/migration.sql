/*
  Warnings:

  - You are about to drop the column `name` on the `Issuer` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Issuer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issuer` DROP COLUMN `name`,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

/*
  Warnings:

  - Added the required column `password` to the `Issuer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issuer` ADD COLUMN `password` VARCHAR(191) NOT NULL;

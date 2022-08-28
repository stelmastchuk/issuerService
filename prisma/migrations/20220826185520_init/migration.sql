-- CreateTable
CREATE TABLE `Issuer` (
    `issuerId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `documentNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Issuer_email_key`(`email`),
    UNIQUE INDEX `Issuer_documentNumber_key`(`documentNumber`),
    PRIMARY KEY (`issuerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

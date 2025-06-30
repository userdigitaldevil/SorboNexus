/*
  Warnings:

  - Added the required column `updatedAt` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Annonce_createdAt_idx";

-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "domains" TEXT[];

-- AlterTable
ALTER TABLE "Annonce" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

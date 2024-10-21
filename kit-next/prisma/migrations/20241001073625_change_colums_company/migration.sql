/*
  Warnings:

  - You are about to drop the column `capitalStock` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `femaleWorkersProportion` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "capitalStock",
DROP COLUMN "femaleWorkersProportion",
DROP COLUMN "status",
ADD COLUMN     "averageSalaryAi" TEXT,
ADD COLUMN     "businessSummaryAi" TEXT;

/*
  Warnings:

  - You are about to drop the column `averageAge` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `averageContinuousServiceYears` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `kana` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "averageAge",
DROP COLUMN "averageContinuousServiceYears",
DROP COLUMN "kana",
ADD COLUMN     "averageAgeAi" DOUBLE PRECISION,
ADD COLUMN     "averageContinuousServiceYearsAi" DOUBLE PRECISION,
ADD COLUMN     "employeeNumberAi" INTEGER,
ADD COLUMN     "keyMessageAi" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "corporateNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kana" TEXT,
    "representativeName" TEXT,
    "postalCode" TEXT,
    "location" TEXT,
    "status" TEXT,
    "capitalStock" BIGINT,
    "employeeNumber" INTEGER,
    "businessItems" TEXT[],
    "businessSummary" TEXT,
    "companyUrl" TEXT,
    "dateOfEstablishment" TIMESTAMP(3),
    "averageContinuousServiceYears" DOUBLE PRECISION,
    "averageAge" DOUBLE PRECISION,
    "femaleWorkersProportion" DOUBLE PRECISION,
    "updateDate" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("corporateNumber")
);

-- CreateTable
CREATE TABLE "WorkplaceInfo" (
    "corporateNumber" TEXT NOT NULL,
    "averageAge" DOUBLE PRECISION,
    "averageContinuousServiceYears" DOUBLE PRECISION,
    "averageContinuousServiceYearsFemale" DOUBLE PRECISION,
    "averageContinuousServiceYearsMale" DOUBLE PRECISION,
    "monthAveragePredeterminedOvertimeHours" DOUBLE PRECISION,
    "femaleWorkersProportionType" TEXT,
    "femaleShareOfManager" DOUBLE PRECISION,
    "femaleShareOfOfficers" DOUBLE PRECISION,
    "genderTotalOfManager" INTEGER,
    "genderTotalOfOfficers" INTEGER,

    CONSTRAINT "WorkplaceInfo_pkey" PRIMARY KEY ("corporateNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_corporateNumber_key" ON "Company"("corporateNumber");

-- AddForeignKey
ALTER TABLE "WorkplaceInfo" ADD CONSTRAINT "WorkplaceInfo_corporateNumber_fkey" FOREIGN KEY ("corporateNumber") REFERENCES "Company"("corporateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

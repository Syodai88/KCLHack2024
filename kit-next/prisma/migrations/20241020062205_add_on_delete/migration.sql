-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Intern" DROP CONSTRAINT "Intern_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Intern" DROP CONSTRAINT "Intern_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("corporateNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("corporateNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intern" ADD CONSTRAINT "Intern_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("corporateNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intern" ADD CONSTRAINT "Intern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("corporateNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

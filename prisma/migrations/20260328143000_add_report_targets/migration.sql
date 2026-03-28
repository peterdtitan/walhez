-- CreateEnum
CREATE TYPE "ReportTarget" AS ENUM ('VESPA_SITE');

-- AlterTable
ALTER TABLE "ReportEntry"
ADD COLUMN     "reportTarget" "ReportTarget",
ALTER COLUMN   "equipmentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ReportEntry_reportTarget_type_entryDate_idx" ON "ReportEntry"("reportTarget", "type", "entryDate");

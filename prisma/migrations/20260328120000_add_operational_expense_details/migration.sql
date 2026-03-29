-- CreateEnum
CREATE TYPE "OperationalExpenseType" AS ENUM (
    'CREW_SALARY',
    'CREW_ALLOWANCE',
    'DIESEL_PURCHASE',
    'FUEL_PURCHASE',
    'MOBILIZATION',
    'DEMOBILIZATION',
    'ROAD_SETTLEMENT'
);

-- AlterTable
ALTER TABLE "ReportEntry"
ADD COLUMN "operationalExpenseType" "OperationalExpenseType",
ADD COLUMN "quantity" INTEGER,
ADD COLUMN "unitPrice" INTEGER;

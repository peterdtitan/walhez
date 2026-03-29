import { getOperationsReportData } from "@/lib/walhez-data";
import OperationsReport from "@/components/OperationsReport";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Reports",
  description: "Protected equipment income and expense reporting for administrators.",
};

export default async function AdminReportsPage() {
  const report = await getOperationsReportData();

  return <OperationsReport report={report} />;
}

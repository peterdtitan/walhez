import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Operations Report PDF | Walhez",
  description: "Redirects to the protected admin PDF report area.",
};

export default async function OperationsReportPdfPage() {
  await requireAdmin();
  redirect("/admin/reports/pdf");
}

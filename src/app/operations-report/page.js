import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Operations Report",
  description: "Redirects to the protected admin report area.",
};

export default async function OperationsReportPage() {
  await requireAdmin();
  redirect("/admin/reports");
}

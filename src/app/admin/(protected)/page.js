import AdminPanel from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/walhez-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage equipment records and financial reports.",
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  const data = await getAdminDashboardData();

  return (
    <AdminPanel
      admin={admin}
      equipment={data.equipment}
      recentEntries={data.recentEntries}
      dashboardMetrics={data.dashboardMetrics}
    />
  );
}

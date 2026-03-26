import AdminPanel from "@/components/AdminPanel";
import { getAdminDashboardData } from "@/lib/walhez-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Walhez",
  description: "Manage equipment records and financial reports.",
};

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <AdminPanel
      equipment={data.equipment}
      recentEntries={data.recentEntries}
    />
  );
}

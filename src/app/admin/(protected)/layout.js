import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";

export default async function ProtectedAdminLayout({ children }) {
  const admin = await requireAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}

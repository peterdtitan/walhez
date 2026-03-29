import { redirect } from "next/navigation";
import AdminInviteSetupForm from "@/components/AdminInviteSetupForm";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAuthenticatedAdmin, getInvitedAdminForSetup } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login",
  description: "Secure login for Walhez administrators.",
};

export default async function AdminLoginPage({ searchParams }) {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect("/admin");
  }

  const inviteToken =
    typeof searchParams?.invite === "string" ? searchParams.invite.trim() : "";

  if (inviteToken) {
    const invitedAdmin = await getInvitedAdminForSetup(inviteToken);

    if (invitedAdmin) {
      return <AdminInviteSetupForm inviteToken={inviteToken} admin={invitedAdmin} />;
    }

    return (
      <AdminLoginForm notice="This invite link is invalid or expired. Ask an existing admin to send a fresh setup link." />
    );
  }

  return <AdminLoginForm />;
}

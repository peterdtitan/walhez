import AdminAccessPanel from "@/components/AdminAccessPanel";
import { getAdminAuthSchema } from "@/lib/admin-auth-schema";
import { requireAdmin } from "@/lib/auth";
import {
  buildAdminInvitePath,
  getAdminFullName,
} from "@/lib/admin-users";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Access | Walhez",
  description: "Invite and manage Walhez administrators.",
};

export default async function AdminAccessPage() {
  const currentAdmin = await requireAdmin();
  const schema = await getAdminAuthSchema();
  const admins = await prisma.adminUser.findMany({
    orderBy: [
      { createdAt: "asc" },
      { username: "asc" },
    ],
    select: {
      id: true,
      username: true,
      passwordHash: true,
      createdAt: true,
      ...(schema.hasEmail ? { email: true } : {}),
      ...(schema.hasProfiles
        ? {
            firstName: true,
            lastName: true,
            activatedAt: true,
          }
        : {}),
      ...(schema.hasInviteFlow
        ? {
            invitedAt: true,
            inviteExpiresAt: true,
            inviteToken: true,
          }
        : {}),
    },
  });

  const adminDirectory = admins
    .map((admin) => ({
      id: admin.id,
      username: admin.username,
      fullName: getAdminFullName(admin),
      email: schema.hasEmail ? admin.email || "" : "",
      isActive: Boolean(admin.passwordHash),
      createdAt: admin.createdAt,
      invitedAt: schema.hasInviteFlow ? admin.invitedAt || null : null,
      inviteExpiresAt: schema.hasInviteFlow ? admin.inviteExpiresAt || null : null,
      activatedAt: schema.hasProfiles ? admin.activatedAt || null : null,
      invitePath:
        schema.hasInviteFlow && admin.inviteToken
          ? buildAdminInvitePath(admin.inviteToken)
          : "",
    }))
    .sort((left, right) => {
      if (left.isActive !== right.isActive) {
        return left.isActive ? -1 : 1;
      }

      return left.username.localeCompare(right.username);
    });

  return (
    <section className="bg-[#f3efe5]">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-[2rem] bg-[#1E2D44] px-6 py-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f2c94c]">
            Admin access
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
            Invite and manage administrators
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
            Create pending admin accounts, email setup links, and track which admins have
            already activated their access.
          </p>
        </div>

        <div className="mt-8">
          <AdminAccessPanel
            admins={adminDirectory}
            currentAdminId={currentAdmin.id}
            inviteFeatureEnabled={schema.hasEmail && schema.hasProfiles && schema.hasInviteFlow}
          />
        </div>
      </div>
    </section>
  );
}

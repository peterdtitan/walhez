import "server-only";

import { prisma } from "./prisma";

let adminAuthSchemaPromise;

async function loadAdminAuthSchema() {
  const columns = await prisma.$queryRaw`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'AdminUser'
  `;

  const columnSet = new Set(columns.map((item) => item.column_name));

  return {
    hasEmail: columnSet.has("email"),
    hasProfiles:
      columnSet.has("firstName") &&
      columnSet.has("lastName") &&
      columnSet.has("activatedAt"),
    hasInviteFlow:
      columnSet.has("inviteToken") &&
      columnSet.has("inviteExpiresAt") &&
      columnSet.has("invitedAt"),
  };
}

export async function getAdminAuthSchema() {
  if (!adminAuthSchemaPromise) {
    adminAuthSchemaPromise = loadAdminAuthSchema();
  }

  return adminAuthSchemaPromise;
}

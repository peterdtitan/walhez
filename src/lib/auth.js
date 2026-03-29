import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuthSchema } from "./admin-auth-schema";
import { prisma } from "./prisma";

const ADMIN_SESSION_COOKIE = "walhez_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const LEGACY_AUTHENTICATED_ADMIN_SELECT = {
  id: true,
  username: true,
  createdAt: true,
  updatedAt: true,
};

function getAuthenticatedAdminSelect(schema) {
  return {
    ...LEGACY_AUTHENTICATED_ADMIN_SELECT,
    ...(schema.hasEmail ? { email: true } : {}),
    ...(schema.hasProfiles
      ? {
          firstName: true,
          lastName: true,
          activatedAt: true,
        }
      : {}),
  };
}

function normalizeAuthenticatedAdmin(admin, schema) {
  if (!admin) {
    return null;
  }

  return {
    ...admin,
    email: schema.hasEmail ? admin.email || null : null,
    firstName: schema.hasProfiles ? admin.firstName || null : null,
    lastName: schema.hasProfiles ? admin.lastName || null : null,
    activatedAt: schema.hasProfiles ? admin.activatedAt || null : null,
  };
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derivedKey = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  const [salt, currentHash] = storedHash.split(":");

  if (!salt || !currentHash) {
    return false;
  }

  const candidateHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(currentHash, "hex"),
    Buffer.from(candidateHash, "hex")
  );
}

export async function createAdminSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearAdminSession() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.adminSession.deleteMany({
      where: { token },
    });
  }

  cookies().delete(ADMIN_SESSION_COOKIE);
}

export async function getAuthenticatedAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const schema = await getAdminAuthSchema();

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: {
      user: {
        select: getAuthenticatedAdminSelect(schema),
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({
        where: { token },
      });
    }
    return null;
  }

  return normalizeAuthenticatedAdmin(session.user, schema);
}

export async function getInvitedAdminForSetup(inviteToken) {
  if (!inviteToken) {
    return null;
  }

  const schema = await getAdminAuthSchema();

  if (!schema.hasInviteFlow || !schema.hasEmail || !schema.hasProfiles) {
    return null;
  }

  const admin = await prisma.adminUser.findUnique({
    where: { inviteToken },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
      inviteExpiresAt: true,
    },
  });

  if (!admin || admin.passwordHash) {
    return null;
  }

  if (admin.inviteExpiresAt && admin.inviteExpiresAt < new Date()) {
    return null;
  }

  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    firstName: admin.firstName,
    lastName: admin.lastName,
    inviteExpiresAt: admin.inviteExpiresAt,
  };
}

export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

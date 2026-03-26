import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const ADMIN_SESSION_COOKIE = "walhez_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derivedKey = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
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

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({
        where: { token },
      });
    }
    return null;
  }

  return session.user;
}

export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

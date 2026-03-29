function capitalizeFirst(value) {
  if (!value) {
    return "";
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function normalizeAdminUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function normalizeAdminEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function getAdminDisplayName(admin) {
  const preferredName =
    admin?.firstName?.trim() || admin?.username?.trim() || admin?.email?.trim() || "";

  return capitalizeFirst(preferredName);
}

export function getAdminFullName(admin) {
  const firstName = admin?.firstName?.trim() || "";
  const lastName = admin?.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || admin?.email?.trim() || getAdminDisplayName(admin);
}

export function buildAdminInvitePath(inviteToken) {
  if (!inviteToken) {
    return "";
  }

  return `/admin/login?invite=${encodeURIComponent(inviteToken)}`;
}

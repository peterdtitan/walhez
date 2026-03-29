import "server-only";

import { headers } from "next/headers";

function getAppOrigin() {
  const configuredOrigin = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  const requestHeaders = headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const protocol =
    requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

  return host ? `${protocol}://${host}` : "";
}

export async function sendAdminInviteEmail({ email, invitePath }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ADMIN_INVITE_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
  const appOrigin = getAppOrigin();

  if (!apiKey || !fromEmail || !appOrigin) {
    return {
      success: false,
      message:
        "The admin invite was saved, but email delivery is not configured. Set RESEND_API_KEY, ADMIN_INVITE_FROM_EMAIL, and APP_URL.",
    };
  }

  const inviteUrl = `${appOrigin}${invitePath}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: "You have been invited as a Walhez admin",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <p>You have been invited to join Walhez as an administrator.</p>
          <p>Use the link below to finish setup and create your password:</p>
          <p><a href="${inviteUrl}">${inviteUrl}</a></p>
          <p>After setup, you will be signed in automatically.</p>
        </div>
      `,
      text: [
        "You have been invited to join Walhez as an administrator.",
        "Use the link below to finish setup and create your password:",
        inviteUrl,
        "After setup, you will be signed in automatically.",
      ].join("\n\n"),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return {
      success: false,
      message:
        "The admin invite was saved, but the email could not be sent. Check your Resend configuration and try again.",
      detail: errorText,
    };
  }

  return {
    success: true,
    inviteUrl,
  };
}

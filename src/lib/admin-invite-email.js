import "server-only";

import { headers } from "next/headers";

function getAppOrigin() {
  const configuredOrigin =
    process.env.APP_URL ||
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

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
  const fromEmail =
    process.env.ADMIN_INVITE_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL;
  const appOrigin = getAppOrigin();

  if (!apiKey || !fromEmail || !appOrigin) {
    return {
      success: false,
      message:
        "The admin invite was saved, but email delivery is not configured. Set RESEND_API_KEY plus either ADMIN_INVITE_FROM_EMAIL or EMAIL_FROM, and either APP_URL or APP_BASE_URL.",
    };
  }

  const inviteUrl = `${appOrigin}${invitePath}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "walhez-admin/1.0",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: "Join the Walhez Group Admin Panel",
      html: `
        <div style="margin: 0; padding: 32px 16px; background-color: #f3efe5; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; border-collapse: collapse; overflow: hidden; border-radius: 28px; background-color: #ffffff; border: 1px solid #e2e8f0;">
                  <tr>
                    <td style="padding: 40px 40px 32px; background: linear-gradient(145deg, #102033 0%, #1e2d44 100%); text-align: center;">
                      <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #f2c94c;">
                        Walhez Group
                      </p>
                      <h1 style="margin: 18px 0 0; font-size: 30px; line-height: 1.2; font-weight: 700; color: #ffffff;">
                        You&apos;re invited to the admin panel
                      </h1>
                      <p style="margin: 16px auto 0; max-width: 460px; font-size: 16px; line-height: 1.7; color: #e2e8f0;">
                        Finish setup with your first name, last name, and password to activate your Walhez administrator access.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 36px 40px 40px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #334155;">
                        An invitation has been created for <strong style="color: #102033;">${email}</strong>. Once setup is complete, you will be signed in automatically and can start using the admin dashboard immediately.
                      </p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 24px; border-collapse: collapse;">
                        <tr>
                          <td align="center" bgcolor="#f2c94c" style="border-radius: 999px;">
                            <a href="${inviteUrl}" style="display: inline-block; padding: 16px 30px; font-size: 16px; font-weight: 700; line-height: 1; color: #102033; text-decoration: none;">
                              Join Admin Panel
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #475569;">
                        If the button does not open, especially from a spam-folder preview, copy and paste this link into your browser:
                      </p>
                      <div style="padding: 16px 18px; border-radius: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                        <a href="${inviteUrl}" style="font-size: 14px; line-height: 1.7; color: #9c3d2b; text-decoration: none; word-break: break-all;">
                          ${inviteUrl}
                        </a>
                      </div>
                      <p style="margin: 20px 0 0; font-size: 13px; line-height: 1.7; color: #64748b;">
                        Need help? Contact the person who invited you for a new link if this one expires.
                      </p>
                      <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.7; color: #94a3b8;">
                        If you were not expecting this invitation, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
      text: [
        "You have been invited to join the Walhez Group Admin Panel.",
        "Finish setup with your first name, last name, and password using the link below:",
        inviteUrl,
        "If the button in the email does not open, copy and paste the link into your browser.",
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

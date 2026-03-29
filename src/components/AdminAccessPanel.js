"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { inviteAdminAction } from "@/app/admin/actions";

const initialActionState = {
  success: false,
  message: "",
  invitePath: "",
};

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildAbsoluteInviteLink(invitePath) {
  if (!invitePath) {
    return "";
  }

  if (typeof window === "undefined") {
    return invitePath;
  }

  return `${window.location.origin}${invitePath}`;
}

function InviteButton({ disabled = false }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="rounded-xl bg-[#1E2D44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263a57] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Preparing invite..." : "Create invite"}
    </button>
  );
}

function CopyInviteButton({ invitePath }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const absoluteLink = buildAbsoluteInviteLink(invitePath);

    if (!absoluteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(absoluteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy invite link", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

function AdminStatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
        isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
      }`}
    >
      {isActive ? "Active" : "Pending setup"}
    </span>
  );
}

export default function AdminAccessPanel({
  admins,
  currentAdminId,
  inviteFeatureEnabled,
}) {
  const [state, formAction] = useFormState(inviteAdminAction, initialActionState);
  const activeAdmins = admins.filter((admin) => admin.isActive).length;
  const pendingAdmins = admins.length - activeAdmins;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9c3d2b]">
            Active admins
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{activeAdmins}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Accounts that already completed name and password setup.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9c3d2b]">
            Pending invites
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{pendingAdmins}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Admin accounts waiting for the invite link to be completed.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9c3d2b]">
            Invite flow
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            Login path setup
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            New admins receive an email invite, open the setup link on `/admin/login`, and
            create their password and profile details there.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
            Invite admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Grant new admin access</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Create a pending admin account with an email address. The new admin will receive
            the setup link by email, then choose their first name, last name, and password.
          </p>

          {!inviteFeatureEnabled ? (
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Email invites are disabled until the latest admin auth migration is applied.
            </p>
          ) : null}

          <form action={formAction} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                disabled={!inviteFeatureEnabled}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
                placeholder="new-admin@walhez.com"
                autoComplete="email"
              />
            </label>

            {state.message ? (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {state.message}
              </p>
            ) : null}

            {state.invitePath ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Setup link
                    </p>
                    <p className="mt-2 break-all rounded-xl bg-white px-3 py-3 text-sm text-slate-700">
                      {state.invitePath}
                    </p>
                  </div>
                  <CopyInviteButton invitePath={state.invitePath} />
                </div>
              </div>
            ) : null}

            <InviteButton disabled={!inviteFeatureEnabled} />
          </form>

          <p className="mt-6 text-sm leading-6 text-slate-600">
            If a pending admin loses their setup link, invite the same email again to issue a
            fresh one.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
            Admin directory
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Current admin accounts</h2>
          <div className="mt-6 space-y-4">
            {admins.map((admin) => (
              <article
                key={admin.id}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900">{admin.fullName}</h3>
                      {admin.id === currentAdminId ? (
                        <span className="rounded-full bg-[#102033] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                          You
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {admin.email || `@${admin.username}`}
                    </p>
                  </div>
                  <AdminStatusBadge isActive={admin.isActive} />
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <p>Created: {formatDateTime(admin.createdAt)}</p>
                  {admin.invitedAt ? <p>Invited: {formatDateTime(admin.invitedAt)}</p> : null}
                  {admin.activatedAt ? (
                    <p>Activated: {formatDateTime(admin.activatedAt)}</p>
                  ) : null}
                  {!admin.isActive && admin.inviteExpiresAt ? (
                    <p>Invite expires: {formatDateTime(admin.inviteExpiresAt)}</p>
                  ) : null}
                </div>

                {!admin.isActive && admin.invitePath ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Setup link
                        </p>
                        <p className="mt-2 break-all text-sm text-slate-700">
                          {admin.invitePath}
                        </p>
                      </div>
                      <CopyInviteButton invitePath={admin.invitePath} />
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

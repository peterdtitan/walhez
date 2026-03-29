"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { completeAdminInviteAction } from "@/app/admin/actions";

const initialActionState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-primaryYellow px-5 py-3 font-semibold text-[#1E2D44] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Setting up account..." : "Create password"}
    </button>
  );
}

export default function AdminInviteSetupForm({ inviteToken, admin }) {
  const [state, formAction] = useFormState(completeAdminInviteAction, initialActionState);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center px-4 py-10">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
          Admin invite
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Finish your admin setup
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Set your first name, last name, and password for the admin account below. You
          will use this email and password for future sign-ins.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Login email
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {admin.email || admin.username}
          </p>
          {admin.inviteExpiresAt ? (
            <p className="mt-2 text-sm text-slate-600">
              Invite expires{" "}
              {new Date(admin.inviteExpiresAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          ) : null}
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <input type="hidden" name="inviteToken" value={inviteToken} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">First name</span>
              <input
                type="text"
                name="firstName"
                defaultValue={admin.firstName || ""}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
                autoComplete="given-name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Last name</span>
              <input
                type="text"
                name="lastName"
                defaultValue={admin.lastName || ""}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
                autoComplete="family-name"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                name="password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
                autoComplete="new-password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </span>
              <input
                type="password"
                name="confirmPassword"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
                autoComplete="new-password"
              />
            </label>
          </div>

          {state.message ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <SubmitButton />
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have a password?{" "}
          <Link href="/admin/login" className="font-semibold text-[#1E2D44]">
            Return to sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

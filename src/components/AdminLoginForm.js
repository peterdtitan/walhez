"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAdminAction } from "@/app/admin/actions";

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
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function AdminLoginForm({ notice = "" }) {
  const [state, formAction] = useFormState(loginAdminAction, initialActionState);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9c3d2b]">
          Admin access
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Walhez control room
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in with your admin email or legacy username to add equipment, upload
          equipment images, and log expenses or income against each machine.
        </p>

        {notice ? (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {notice}
          </p>
        ) : null}

        <form action={formAction} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email or username
            </span>
            <input
              type="text"
              name="identifier"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
              placeholder="admin@walhez.com or admin"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#1E2D44]"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </label>

          {state.message ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

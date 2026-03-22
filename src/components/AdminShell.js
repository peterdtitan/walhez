"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/app/admin/actions";

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reports", label: "Reports" },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "bg-[#f2c94c] text-[#102033]"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3efe5] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#102033] text-white print:hidden lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f2c94c]">
              Walhez admin
            </p>
            <p className="mt-1 text-sm text-slate-300">{admin.username}</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold"
          >
            Menu
          </button>
        </div>

        {menuOpen ? (
          <div className="space-y-4 border-t border-white/10 px-4 py-4">
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        ) : null}
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#102033] px-6 py-8 text-white print:hidden lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f2c94c]">
              Walhez admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold">Control room</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Manage equipment records and view filtered income and expense reports.
            </p>
          </div>

          <div className="mt-10">
            <NavLinks pathname={pathname} />
          </div>

          <div className="mt-auto space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">{admin.username}</p>
              <p className="mt-1 text-sm text-slate-300">Authenticated administrator</p>
            </div>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

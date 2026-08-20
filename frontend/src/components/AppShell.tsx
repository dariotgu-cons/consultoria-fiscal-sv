"use client";

import { signOut, type User } from "firebase/auth";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3 dark:border-white/10 dark:bg-zinc-900">
        <Link href="/cartera" className="text-sm font-semibold text-black dark:text-zinc-50">
          Consultoría Fiscal SV
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">{user.email}</span>
          <button
            type="button"
            onClick={() => signOut(getFirebaseAuth())}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/[.04]"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

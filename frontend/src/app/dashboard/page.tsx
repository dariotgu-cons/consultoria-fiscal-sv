"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 dark:bg-black">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Bienvenido{user.displayName ? `, ${user.displayName}` : ""}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="mt-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/[.04]"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

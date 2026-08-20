"use client";

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { useState } from "react";
import { authErrorCode, mapAuthError } from "@/lib/auth-errors";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase";

export default function LoginForm() {
  const { redirectError, redirectDebug, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      // onAuthStateChanged (in AuthProvider) picks up the new session and
      // the root page redirects to /dashboard once `user` updates.
    } catch (err) {
      setError(mapAuthError(authErrorCode(err)));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      // Popups get blocked by browsers/extensions often enough in production
      // that a full-page redirect is the reliable way to do this.
      await signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
    } catch (err) {
      setError(mapAuthError(authErrorCode(err)));
      setSubmitting(false);
    }
  }

  const displayedError = error ?? redirectError;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900"
    >
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Iniciar sesión
      </h1>

      {displayedError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {displayedError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
          placeholder="usuario@ejemplo.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        Entrar
      </button>

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        o
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:opacity-50 dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/[.04]"
      >
        Continuar con Google
      </button>

      {/* Panel temporal de diagnostico -- quitar una vez resuelto el login con Google */}
      <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-100 p-2 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        {JSON.stringify({ authLoading: loading, redirectDebug }, null, 2)}
      </pre>
    </form>
  );
}

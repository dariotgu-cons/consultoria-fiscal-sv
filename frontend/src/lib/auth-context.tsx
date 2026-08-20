"use client";

import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { authErrorCode, mapAuthError } from "@/lib/auth-errors";
import { getFirebaseAuth } from "@/lib/firebase";

type RedirectDebugInfo = {
  status: "pending" | "no-redirect" | "success" | "error";
  rawCode?: string;
  rawMessage?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  redirectError: string | null;
  redirectDebug: RedirectDebugInfo;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  redirectError: null,
  redirectDebug: { status: "pending" },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [redirectDebug, setRedirectDebug] = useState<RedirectDebugInfo>({ status: "pending" });

  useEffect(() => {
    const auth = getFirebaseAuth();

    // Must run as early as possible (before any conditional rendering can
    // delay it) so it reliably catches the result of signInWithRedirect.
    getRedirectResult(auth)
      .then((result) => {
        setRedirectDebug({ status: result ? "success" : "no-redirect" });
      })
      .catch((err) => {
        const code = authErrorCode(err);
        setRedirectError(mapAuthError(code));
        setRedirectDebug({
          status: "error",
          rawCode: code,
          rawMessage: err instanceof Error ? err.message : String(err),
        });
      });

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, redirectError, redirectDebug }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

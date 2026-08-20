"use client";

import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { authErrorCode, mapAuthError } from "@/lib/auth-errors";
import { getFirebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  redirectError: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  redirectError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    // Must run as early as possible (before any conditional rendering can
    // delay it) so it reliably catches the result of signInWithRedirect.
    getRedirectResult(auth).catch((err) => {
      setRedirectError(mapAuthError(authErrorCode(err)));
    });

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, redirectError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

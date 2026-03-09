import React, { createContext, useContext, useEffect, useState } from "react";
import { loadAuth, saveAuth, clearAuth } from "./auth";
import type { User } from "./types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuth().then((auth) => {
      if (auth) {
        setToken(auth.token);
        setUser(auth.user);
      }
      setIsLoading(false);
    });
  }, []);

  const signIn = async (newToken: string, newUser: User) => {
    await saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

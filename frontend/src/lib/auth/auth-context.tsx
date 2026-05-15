"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi, register as registerApi } from "@/lib/api/auth";
import type { LoginRequest, RegisterRequest, User } from "@/types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

interface AuthContextType extends AuthState {
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Set or remove the access_token cookie for middleware redirect detection */
function setAuthCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  } else {
    document.cookie = "access_token=; path=/; max-age=0";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });

  const isAdmin = state.user?.role === "admin" || state.user?.is_superuser === true;

  const hasRole = useCallback(
    (role: string) => {
      if (!state.user) return false;
      if (state.user.is_superuser) return true;
      return state.user.role === role;
    },
    [state.user]
  );

  const refreshUser = useCallback(async () => {
    try {
      const user = await getMe();
      setState({ user, loading: false, authenticated: true });
    } catch {
      setState({ user: null, loading: false, authenticated: false });
      setAuthCookie(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Sync cookie on page load so middleware sees it
      setAuthCookie(token);
      refreshUser();
    } else {
      setState({ user: null, loading: false, authenticated: false });
    }
  }, [refreshUser]);

  const login = async (data: LoginRequest) => {
    const tokens = await loginApi(data);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setAuthCookie(tokens.access_token);
    await refreshUser();
  };

  const register = async (data: RegisterRequest) => {
    await registerApi(data);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthCookie(null);
    setState({ user: null, loading: false, authenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, isAdmin, login, register, logout, refreshUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Convenience hook for role-based access */
export function useRole() {
  const { isAdmin, hasRole } = useAuth();
  return { isAdmin, hasRole };
}

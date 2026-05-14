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
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const user = await getMe();
      setState({ user, loading: false, authenticated: true });
    } catch {
      setState({ user: null, loading: false, authenticated: false });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      refreshUser();
    } else {
      setState({ user: null, loading: false, authenticated: false });
    }
  }, [refreshUser]);

  const login = async (data: LoginRequest) => {
    const tokens = await loginApi(data);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await refreshUser();
  };

  const register = async (data: RegisterRequest) => {
    await registerApi(data);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setState({ user: null, loading: false, authenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

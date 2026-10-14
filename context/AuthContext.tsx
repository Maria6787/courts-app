"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/policy";
import type { SessionUser } from "@/lib/types";

interface AuthContextValue {
  user: SessionUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Map a Supabase session into our lightweight SessionUser shape. */
function toSessionUser(session: Session | null): SessionUser | null {
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email ?? "",
    // `name` is stored in user_metadata at sign-up; fall back to the email.
    name: (u.user_metadata?.name as string | undefined) ?? u.email ?? "User",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate the current session and subscribe to auth changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toSessionUser(data.session));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toSessionUser(session));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }, // stored in user_metadata
      });
      if (error) throw new Error(error.message);
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const isAdmin = isAdminEmail(user?.email);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

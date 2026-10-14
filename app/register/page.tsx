"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Supabase may require email confirmation before a session exists.
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      // If email confirmation is OFF, a session is created immediately and the
      // auth listener will populate `user` — send them home. If it's ON, there
      // is no session yet, so show a "check your email" message instead.
      if (user) {
        router.push("/");
        router.refresh();
      } else {
        setNeedsConfirm(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />

      <div className="glass relative w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg">
            <Dumbbell className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-black">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join Courts and start booking in seconds.
          </p>
        </div>

        {needsConfirm ? (
          <div className="rounded-xl bg-brand-500/10 px-4 py-6 text-center">
            <p className="font-semibold">Check your email 📩</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              We sent a confirmation link to <strong>{email}</strong>. Confirm
              it, then log in.
            </p>
            <Link
              href="/login"
              className="brand-gradient mt-4 inline-block rounded-xl px-5 py-2.5 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-10 pr-4 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-10 pr-4 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-10 pr-4 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating account…" : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

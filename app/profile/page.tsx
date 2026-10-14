"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Receipt, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings } from "@/lib/bookings";
import { supabase } from "@/lib/supabase";
import { formatIDR } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function ProfilePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setBookings(await getMyBookings(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/profile");
      return;
    }
    setName(user.name);
    void load();
  }, [authLoading, user, router, load]);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  const saveName = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { name } });
      if (error) throw error;
      notify("Profile updated.");
    } catch {
      notify("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const payments = bookings.filter((b) => b.status !== "CANCELLED");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 flex items-center gap-2 text-3xl font-black">
        <UserIcon className="h-7 w-7 text-brand-500" />
        My Profile
      </h1>

      {/* Account */}
      <div className="glass mb-6 rounded-3xl p-6">
        <h2 className="mb-4 text-lg font-bold">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          {isAdmin && (
            <p className="text-sm font-medium text-accent-600">
              You have admin access.
            </p>
          )}
          <button
            onClick={saveName}
            disabled={saving || name.trim() === user.name}
            className="brand-gradient rounded-xl px-5 py-2.5 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Payment history */}
      <div className="glass rounded-3xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Receipt className="h-5 w-5 text-brand-500" />
          Payment history
        </h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No payments yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {payments.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {b.courtName} · {b.slotLabel}
                  </p>
                  <p className="text-xs text-slate-400">
                    Ref {b.reference} ·{" "}
                    {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold">{formatIDR(b.deposit)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-in rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  );
}

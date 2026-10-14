"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Trash2,
  UserX,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  clearAllBookings,
  getAllBookings,
  updateBookingStatus,
} from "@/lib/bookings";
import { formatIDR } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_BADGE: Record<BookingStatus, string> = {
  CONFIRMED: "bg-brand-500/15 text-brand-700 dark:text-brand-300",
  COMPLETED: "bg-accent-500/20 text-accent-700 dark:text-accent-400",
  NO_SHOW: "bg-red-500/15 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-400/20 text-slate-500 dark:text-slate-400",
};

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await getAllBookings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/");
      return;
    }
    void load();
  }, [authLoading, user, isAdmin, router, load]);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 4000);
  };

  const setStatus = async (id: string, status: BookingStatus) => {
    setBusyId(id);
    try {
      await updateBookingStatus(id, status);
      await load();
      notify(`Marked as ${status.replace("_", "-").toLowerCase()}.`);
    } catch {
      notify("Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        "Delete ALL bookings permanently? This frees database storage and cannot be undone.",
      )
    )
      return;
    try {
      await clearAllBookings();
      await load();
      notify("All bookings cleared.");
    } catch {
      notify("Could not clear bookings.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Analytics.
  const revenueCollected = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.deposit, 0);
  const noShowCount = bookings.filter((b) => b.status === "NO_SHOW").length;
  const activeCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const total = bookings.length;
  const noShowRate = total ? Math.round((noShowCount / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black">
            <ShieldAlert className="h-7 w-7 text-brand-500" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage every booking, mark attendance, and view analytics.
          </p>
        </div>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
          Clear all bookings
        </button>
      </div>

      {/* Analytics cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total bookings" value={String(total)} icon={BarChart3} />
        <Stat label="Active (upcoming)" value={String(activeCount)} />
        <Stat label="Deposits collected" value={formatIDR(revenueCollected)} />
        <Stat label="No-show rate" value={`${noShowRate}%`} />
      </div>

      {/* Bookings table */}
      {bookings.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400">
          No bookings yet.
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Ref</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Court</th>
                <th className="px-5 py-3">Date / Time</th>
                <th className="px-5 py-3">Deposit</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                >
                  <td className="px-5 py-3 font-mono text-xs">{b.reference}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-slate-400">
                      {b.customerEmail}
                    </div>
                  </td>
                  <td className="px-5 py-3">{b.courtName}</td>
                  <td className="px-5 py-3">
                    {new Date(b.startTime).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {b.slotLabel}
                  </td>
                  <td className="px-5 py-3">{formatIDR(b.deposit)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[b.status]}`}
                    >
                      {b.status.replace("_", "-")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setStatus(b.id, "COMPLETED")}
                        disabled={busyId === b.id || b.status === "COMPLETED"}
                        title="Mark completed"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition hover:bg-accent-500/10 disabled:opacity-40 dark:border-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-accent-600" />
                      </button>
                      <button
                        onClick={() => setStatus(b.id, "NO_SHOW")}
                        disabled={busyId === b.id || b.status === "NO_SHOW"}
                        title="Mark no-show (forfeit deposit)"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 transition hover:bg-red-500/10 disabled:opacity-40 dark:border-slate-700"
                      >
                        <UserX className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-in rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof BarChart3;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

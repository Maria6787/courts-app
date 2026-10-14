"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2, Loader2, Ticket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings, updateBookingStatus } from "@/lib/bookings";
import { formatIDR } from "@/lib/format";
import { canCancelFree, POLICY } from "@/lib/policy";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_BADGE: Record<BookingStatus, string> = {
  CONFIRMED: "bg-brand-500/15 text-brand-700 dark:text-brand-300",
  COMPLETED: "bg-accent-500/20 text-accent-700 dark:text-accent-400",
  NO_SHOW: "bg-red-500/15 text-red-600 dark:text-red-400",
  CANCELLED: "bg-slate-400/20 text-slate-500 dark:text-slate-400",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  NO_SHOW: "No-show",
  CANCELLED: "Cancelled",
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
      router.replace("/login?redirect=/bookings");
      return;
    }
    void load();
  }, [authLoading, user, router, load]);

  const handleCancel = async (b: Booking) => {
    const free = canCancelFree(new Date(b.startTime));
    const msg = free
      ? "Cancel this booking? Your deposit will be refunded (simulated)."
      : `You're within ${POLICY.FREE_CANCEL_HOURS}h of the start time — your deposit (${formatIDR(
          b.deposit,
        )}) will be forfeited. Cancel anyway?`;
    if (!confirm(msg)) return;

    setBusyId(b.id);
    try {
      await updateBookingStatus(b.id, "CANCELLED");
      setToast(
        free
          ? "Booking cancelled. Deposit refunded (simulated)."
          : "Booking cancelled. Deposit forfeited per policy.",
      );
      await load();
    } catch {
      setToast("Could not cancel. Please try again.");
    } finally {
      setBusyId(null);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-black">
        <Ticket className="h-7 w-7 text-brand-500" />
        My Bookings
      </h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Your upcoming and past court reservations.
      </p>

      {bookings.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400">
          <CalendarX2 className="h-12 w-12 opacity-40" />
          <p className="font-medium">No bookings yet.</p>
          <Link
            href="/#booking"
            className="brand-gradient mt-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Book a court
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const upcoming = new Date(b.startTime).getTime() > Date.now();
            const cancellable = b.status === "CONFIRMED" && upcoming;
            return (
              <div
                key={b.id}
                className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{b.courtName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[b.status]}`}
                    >
                      {STATUS_LABEL[b.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(b.startTime).toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {b.slotLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Ref {b.reference} · Deposit {formatIDR(b.deposit)} · Balance{" "}
                    {formatIDR(b.balance)}
                  </p>
                </div>

                {cancellable && (
                  <button
                    onClick={() => handleCancel(b)}
                    disabled={busyId === b.id}
                    className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  >
                    {busyId === b.id ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </div>
            );
          })}
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

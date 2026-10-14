"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings } from "@/lib/bookings";
import { formatIDR } from "@/lib/format";
import { POLICY } from "@/lib/policy";
import type { Booking } from "@/lib/types";

function ConfirmedInner() {
  const { user, loading: authLoading } = useAuth();
  const params = useSearchParams();
  const reference = params.get("ref");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      try {
        const all = await getMyBookings(user.id);
        setBooking(all.find((b) => b.reference === reference) ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user, reference]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="glass rounded-3xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/20">
          <CheckCircle2 className="h-12 w-12 text-accent-600" />
        </div>
        <h1 className="text-3xl font-black">Booking confirmed!</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Your deposit is paid and your court is reserved. See you on court! 🎾
        </p>

        <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl bg-brand-500/10 px-8 py-4">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Booking reference
          </span>
          <span className="text-2xl font-black tracking-widest text-brand-700 dark:text-brand-300">
            {reference ?? "—"}
          </span>
        </div>

        {booking && (
          <div className="mt-6 space-y-2 rounded-2xl border border-slate-200 p-5 text-left text-sm dark:border-slate-800">
            <Row label="Court" value={booking.courtName} />
            <Row
              label="Date"
              value={new Date(booking.startTime).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Row label="Time" value={booking.slotLabel} />
            <hr className="my-2 border-slate-200 dark:border-slate-800" />
            <Row label="Total" value={formatIDR(booking.total)} />
            <Row
              label="Deposit paid"
              value={formatIDR(booking.deposit)}
              highlight
            />
            <Row label="Balance at venue" value={formatIDR(booking.balance)} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <Mail className="h-4 w-4" />A confirmation receipt has been sent to
          your email (simulated).
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Free cancellation up to {POLICY.FREE_CANCEL_HOURS}h before start.
          No-shows forfeit the deposit.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/bookings"
            className="brand-gradient rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            View my bookings
          </Link>
          <Link
            href="/#booking"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Book another
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={
          highlight
            ? "font-bold text-brand-700 dark:text-brand-300"
            : "font-semibold"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ConfirmedInner />
    </Suspense>
  );
}

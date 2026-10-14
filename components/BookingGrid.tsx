"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buildSlots, COURTS, toDateKey, type CourtInfo } from "@/lib/data";
import { getTakenSlots } from "@/lib/bookings";
import { saveDraft } from "@/lib/draft";
import { formatIDR } from "@/lib/format";
import { POLICY, validateBookingWindow } from "@/lib/policy";
import type { Slot, SportType } from "@/lib/types";

interface Toast {
  type: "success" | "error";
  message: string;
}

const SPORTS: { key: SportType | "ALL"; label: string }[] = [
  { key: "ALL", label: "All sports" },
  { key: "PADEL", label: "🎾 Padel" },
  { key: "BADMINTON", label: "🏸 Badminton" },
];

export function BookingGrid() {
  const { user } = useAuth();
  const router = useRouter();

  // Selected date (defaults to today). Bounded by the advance window.
  const [dayOffset, setDayOffset] = useState(0);
  const [sportFilter, setSportFilter] = useState<SportType | "ALL">("ALL");
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const dateKey = toDateKey(selectedDate);

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 4000);
  };

  // Load which slots are already taken for the selected date (from Supabase).
  const loadTaken = useCallback(async () => {
    setLoading(true);
    try {
      setTaken(await getTakenSlots(dateKey));
    } catch {
      // If Supabase isn't configured yet, just show everything as available.
      setTaken(new Set());
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => {
    void loadTaken();
  }, [loadTaken]);

  const courts = useMemo(
    () =>
      sportFilter === "ALL"
        ? COURTS
        : COURTS.filter((c) => c.sport === sportFilter),
    [sportFilter],
  );

  // Begin a booking: enforce auth + window rules, then go to checkout.
  const handleSelect = (court: CourtInfo, slot: Slot) => {
    // RULE: must be logged in.
    if (!user) {
      showToast({
        type: "error",
        message: "Please log in or sign up to book a court.",
      });
      router.push("/login?redirect=/#booking");
      return;
    }

    // RULE: advance window / minimum notice / no past slots.
    const windowError = validateBookingWindow(new Date(slot.startTime));
    if (windowError) {
      showToast({ type: "error", message: windowError });
      return;
    }

    // RULE: slot not already taken.
    if (taken.has(`${court.id}|${slot.label}`)) {
      showToast({
        type: "error",
        message: "Slot already reserved! Please pick another time slot.",
      });
      return;
    }

    // Stash the draft and move to the review/payment step.
    saveDraft({
      courtId: court.id,
      courtName: court.name,
      sport: court.sport,
      slotId: slot.id,
      slotLabel: slot.label,
      bookingDate: dateKey,
      startTime: slot.startTime,
      pricePerSlot: court.pricePerSlot,
    });
    router.push("/checkout");
  };

  const dateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const isToday = dayOffset === 0;
  const atMaxDay = dayOffset >= POLICY.MAX_ADVANCE_DAYS;

  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-3xl font-black sm:text-4xl">
          <CalendarClock className="h-8 w-8 text-brand-500" />
          Book a Court
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Pick a date and an open time slot. A{" "}
          {Math.round(POLICY.DEPOSIT_RATE * 100)}% deposit confirms your
          booking.
        </p>
      </div>

      {/* Controls: date stepper + sport filter */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDayOffset((d) => Math.max(0, d - 1))}
            disabled={isToday}
            aria-label="Previous day"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-32 rounded-xl bg-slate-200/60 px-4 py-2 text-center text-sm font-semibold dark:bg-slate-800">
            {isToday ? "Today" : dateLabel}
          </div>
          <button
            onClick={() =>
              setDayOffset((d) => Math.min(POLICY.MAX_ADVANCE_DAYS, d + 1))
            }
            disabled={atMaxDay}
            aria-label="Next day"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSportFilter(s.key)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                sportFilter === s.key
                  ? "brand-gradient text-white shadow"
                  : "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand-500" />
          <span className="text-slate-600 dark:text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-400" />
          <span className="text-slate-600 dark:text-slate-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-400">
            Closed / past
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {courts.map((court) => {
            const slots = buildSlots(court.id, selectedDate);
            const openCount = slots.filter((s) => {
              const isTaken = taken.has(`${court.id}|${s.label}`);
              const past =
                validateBookingWindow(new Date(s.startTime)) !== null;
              return !isTaken && !past;
            }).length;

            return (
              <div key={court.id} className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{court.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {court.sport === "PADEL" ? "🎾 Padel" : "🏸 Badminton"} ·{" "}
                      {formatIDR(court.pricePerSlot)}/hour
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                    {openCount} open
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => {
                    const isTaken = taken.has(`${court.id}|${slot.label}`);
                    const past =
                      validateBookingWindow(new Date(slot.startTime)) !== null;
                    const disabled = isTaken || past;

                    const className = isTaken
                      ? "border-slate-300/50 bg-slate-200/60 text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500 cursor-not-allowed"
                      : past
                        ? "border-amber-400/30 bg-amber-500/5 text-amber-700/60 dark:text-amber-300/50 cursor-not-allowed"
                        : "border-brand-400/40 bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 dark:text-brand-200 cursor-pointer";

                    return (
                      <button
                        key={slot.id}
                        disabled={disabled}
                        onClick={() => handleSelect(court, slot)}
                        className={`w-full rounded-xl border px-2 py-3 text-center text-sm font-medium transition ${className}`}
                      >
                        <span className="block font-semibold">
                          {slot.label}
                        </span>
                        <span className="text-xs opacity-70">
                          {isTaken
                            ? "Booked"
                            : past
                              ? "Unavailable"
                              : "Available"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-in rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
            toast.type === "success" ? "bg-accent-600" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
}

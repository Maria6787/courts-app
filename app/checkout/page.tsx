"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clearDraft, loadDraft } from "@/lib/draft";
import { createBooking } from "@/lib/bookings";
import { formatIDR } from "@/lib/format";
import {
  balanceOf,
  depositOf,
  POLICY,
  PROMO_CODES,
  validateBookingWindow,
} from "@/lib/policy";
import type { BookingDraft } from "@/lib/types";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [ready, setReady] = useState(false);

  // Simulated card fields.
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Promo + terms.
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Load the draft + guard access.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/checkout");
      return;
    }
    const d = loadDraft();
    if (!d) {
      router.replace("/#booking");
      return;
    }
    // Re-validate the window in case the user lingered.
    const windowError = validateBookingWindow(new Date(d.startTime));
    if (windowError) {
      setError(windowError);
    }
    setDraft(d);
    setCardName(user.name);
    setReady(true);
  }, [authLoading, user, router]);

  const subtotal = draft?.pricePerSlot ?? 0;

  const discount = useMemo(() => {
    if (!promoApplied) return 0;
    const p = PROMO_CODES[promoApplied];
    return p ? Math.round((subtotal * p.percentOff) / 100) : 0;
  }, [promoApplied, subtotal]);

  const total = subtotal - discount;
  const deposit = depositOf(total);
  const balance = balanceOf(total);

  const applyPromo = () => {
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (!PROMO_CODES[code]) {
      setPromoError("Invalid promo code.");
      return;
    }
    setPromoApplied(code);
  };

  // Light formatting for the simulated card number / expiry.
  const onCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  };
  const onExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setExpiry(
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
    );
  };

  const canPay =
    agree &&
    cardName.trim() &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvc.length >= 3 &&
    !error;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || !user || !canPay) return;
    setProcessing(true);
    setError(null);
    try {
      // Simulate a payment gateway round-trip.
      await new Promise((r) => setTimeout(r, 1400));

      const booking = await createBooking({
        userId: user.id,
        customerName: cardName.trim(),
        customerEmail: user.email,
        draft,
        total,
        promoCode: promoApplied,
      });

      clearDraft();
      router.push(`/booking/confirmed?ref=${booking.reference}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
      setProcessing(false);
    }
  };

  if (!ready || !draft) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const dateLabel = new Date(draft.startTime).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-3xl font-black">Checkout</h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Pay a {Math.round(POLICY.DEPOSIT_RATE * 100)}% deposit now to confirm.
        The rest is paid at the venue.
      </p>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Payment form */}
        <form
          onSubmit={handlePay}
          className="glass rounded-3xl p-6 lg:col-span-3"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <CreditCard className="h-5 w-5 text-brand-500" />
            Payment details
          </h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Name on card
              </label>
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Card number
              </label>
              <input
                value={cardNumber}
                onChange={(e) => onCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium">
                  Expiry
                </label>
                <input
                  value={expiry}
                  onChange={(e) => onExpiry(e.target.value)}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium">CVC</label>
                <input
                  value={cvc}
                  onChange={(e) =>
                    setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                />
              </div>
            </div>

            {/* Promo */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Promo code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. MABAR10"
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-10 pr-4 uppercase outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyPromo}
                  className="rounded-xl border border-slate-300 px-4 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-1 text-xs text-red-500">{promoError}</p>
              )}
              {promoApplied && (
                <p className="mt-1 text-xs text-accent-600">
                  Applied {promoApplied} — {PROMO_CODES[promoApplied].label} (
                  {PROMO_CODES[promoApplied].percentOff}% off)
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/policies"
                  target="_blank"
                  className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  deposit &amp; cancellation policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!canPay || processing}
              className="brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay deposit {formatIDR(deposit)}
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Simulated payment — no real card is charged.
            </p>
          </div>
        </form>

        {/* Order summary */}
        <aside className="glass h-fit rounded-3xl p-6 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <CalendarClock className="h-5 w-5 text-brand-500" />
            Booking summary
          </h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Court</dt>
              <dd className="font-semibold">{draft.courtName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Sport</dt>
              <dd className="font-semibold">
                {draft.sport === "PADEL" ? "Padel" : "Badminton"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Date</dt>
              <dd className="text-right font-semibold">{dateLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Time</dt>
              <dd className="font-semibold">{draft.slotLabel}</dd>
            </div>
          </dl>

          <hr className="my-4 border-slate-200 dark:border-slate-800" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
              <dd>{formatIDR(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-600">
                <dt>Discount</dt>
                <dd>−{formatIDR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd>{formatIDR(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 space-y-2 rounded-2xl bg-brand-500/10 p-4 text-sm">
            <div className="flex justify-between font-bold text-brand-700 dark:text-brand-300">
              <span>
                Deposit due now ({Math.round(POLICY.DEPOSIT_RATE * 100)}%)
              </span>
              <span>{formatIDR(deposit)}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Balance at venue</span>
              <span>{formatIDR(balance)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Free cancellation up to {POLICY.FREE_CANCEL_HOURS}h before start.
            No-shows forfeit the deposit.
          </p>
        </aside>
      </div>
    </div>
  );
}

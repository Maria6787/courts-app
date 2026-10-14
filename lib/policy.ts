// ─────────────────────────────────────────────────────────────────────────────
// Booking policy — single source of truth for all booking rules.
//
// Changing a number here updates it everywhere (checkout, policies page, admin,
// rule enforcement). Keep business rules in this one file.
// ─────────────────────────────────────────────────────────────────────────────

export const POLICY = {
  /** Fraction of the total paid online now as a deposit (0.5 = 50%). */
  DEPOSIT_RATE: 0.5,

  /** Hours before start that free cancellation is allowed. Within this → forfeit. */
  FREE_CANCEL_HOURS: 24,

  /** How many days ahead a slot can be booked. */
  MAX_ADVANCE_DAYS: 14,

  /** Minimum notice (hours) before a slot's start that it can be booked. */
  MIN_NOTICE_HOURS: 1,

  /** Admin is identified by this email (set via env; never hardcode secrets). */
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
} as const;

/** Promo codes (simulated). code → percentage discount on the TOTAL. */
export const PROMO_CODES: Record<
  string,
  { label: string; percentOff: number }
> = {
  MABAR10: { label: "Mabar group discount", percentOff: 10 },
  COURTS20: { label: "Launch promo", percentOff: 20 },
  PADEL15: { label: "Padel special", percentOff: 15 },
};

/** Compute the deposit (rounded to whole IDR) from a total. */
export function depositOf(total: number): number {
  return Math.round(total * POLICY.DEPOSIT_RATE);
}

/** Compute the balance due at the venue. */
export function balanceOf(total: number): number {
  return total - depositOf(total);
}

/** Is the given email the admin? */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email || !POLICY.ADMIN_EMAIL) return false;
  return email.toLowerCase() === POLICY.ADMIN_EMAIL.toLowerCase();
}

/**
 * Validate whether a slot start time is bookable under the advance/notice rules.
 * Returns an error message string, or null if it's OK to book.
 */
export function validateBookingWindow(
  startTime: Date,
  now = new Date(),
): string | null {
  const diffMs = startTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffMs <= 0) {
    return "That time slot is in the past.";
  }
  if (diffHours < POLICY.MIN_NOTICE_HOURS) {
    return `Bookings must be made at least ${POLICY.MIN_NOTICE_HOURS} hour(s) in advance.`;
  }
  if (diffDays > POLICY.MAX_ADVANCE_DAYS) {
    return `You can only book up to ${POLICY.MAX_ADVANCE_DAYS} days ahead.`;
  }
  return null;
}

/** Can this booking still be cancelled for free (outside the cancel window)? */
export function canCancelFree(startTime: Date, now = new Date()): boolean {
  const diffHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours >= POLICY.FREE_CANCEL_HOURS;
}

// Pending booking draft kept in sessionStorage between the grid and checkout.
// sessionStorage (not localStorage) so a half-finished booking doesn't linger
// across browser sessions.

import type { BookingDraft } from "./types";

const KEY = "courts_booking_draft";

export function saveDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function loadDraft(): BookingDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

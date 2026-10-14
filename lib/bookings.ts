// ─────────────────────────────────────────────────────────────────────────────
// Bookings data layer — all Supabase reads/writes for bookings & reviews.
//
// Row-Level Security (set up via the SQL in SUPABASE_SETUP.sql) ensures a user
// can only see/modify their own bookings, while the admin can see all.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "./supabase";
import type { Booking, BookingDraft, BookingStatus, Review } from "./types";
import { balanceOf, depositOf } from "./policy";

// Map a snake_case DB row → camelCase Booking.
function rowToBooking(r: Record<string, unknown>): Booking {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    customerName: r.customer_name as string,
    customerEmail: r.customer_email as string,
    courtId: r.court_id as string,
    courtName: r.court_name as string,
    sport: r.sport as Booking["sport"],
    slotLabel: r.slot_label as string,
    bookingDate: r.booking_date as string,
    startTime: r.start_time as string,
    reference: r.reference as string,
    total: r.total as number,
    deposit: r.deposit as number,
    balance: r.balance as number,
    promoCode: (r.promo_code as string | null) ?? null,
    status: r.status as BookingStatus,
    createdAt: r.created_at as string,
  };
}

/** Generate a short human-friendly booking reference, e.g. "CRT-8F3K". */
export function makeReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CRT-${s}`;
}

/** All bookings for the signed-in user (newest first). */
export async function getMyBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToBooking);
}

/** All bookings in the system (admin only — enforced by RLS). */
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("start_time", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToBooking);
}

/**
 * Active (non-cancelled) bookings for a given date, used to grey out slots that
 * someone else already took. Returns a Set of `${courtId}|${slotLabel}`.
 */
export async function getTakenSlots(date: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("bookings")
    .select("court_id, slot_label, status")
    .eq("booking_date", date)
    .neq("status", "CANCELLED");
  if (error) throw new Error(error.message);
  const set = new Set<string>();
  for (const r of data ?? []) {
    set.add(`${r.court_id}|${r.slot_label}`);
  }
  return set;
}

export interface CreateBookingInput {
  userId: string;
  customerName: string;
  customerEmail: string;
  draft: BookingDraft;
  total: number;
  promoCode: string | null;
}

/**
 * Create a confirmed booking after (simulated) deposit payment.
 * A unique DB constraint on (court_id, booking_date, slot_label) for active
 * bookings is the backstop against double-booking the same slot.
 */
export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  const reference = makeReference();
  const deposit = depositOf(input.total);
  const balance = balanceOf(input.total);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: input.userId,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      court_id: input.draft.courtId,
      court_name: input.draft.courtName,
      sport: input.draft.sport,
      slot_label: input.draft.slotLabel,
      booking_date: input.draft.bookingDate,
      start_time: input.draft.startTime,
      reference,
      total: input.total,
      deposit,
      balance,
      promo_code: input.promoCode,
      status: "CONFIRMED",
    })
    .select()
    .single();

  if (error) {
    // Unique violation → the slot was taken a moment ago.
    if (error.code === "23505") {
      throw new Error("Slot already reserved! Please pick another time slot.");
    }
    throw new Error(error.message);
  }
  return rowToBooking(data);
}

/** Update a booking's status (cancel / no-show / complete). */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Admin: delete ALL bookings (frees storage). RLS restricts this to admin. */
export async function clearAllBookings(): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // match all
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────────────────────

function rowToReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    courtId: r.court_id as string,
    userId: r.user_id as string,
    userName: r.user_name as string,
    rating: r.rating as number,
    comment: r.comment as string,
    createdAt: r.created_at as string,
  };
}

export async function getReviews(courtId?: string): Promise<Review[]> {
  let q = supabase.from("reviews").select("*").order("created_at", {
    ascending: false,
  });
  if (courtId) q = q.eq("court_id", courtId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToReview);
}

export async function addReview(input: {
  courtId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      court_id: input.courtId,
      user_id: input.userId,
      user_name: input.userName,
      rating: input.rating,
      comment: input.comment,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToReview(data);
}

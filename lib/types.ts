// Shared client-side types for the static (no-backend) app.

export type SportType = "PADEL" | "BADMINTON";
export type SlotStatus = "AVAILABLE" | "BOOKED" | "WALK_IN_RESERVED";

/** The signed-in user kept in the browser (localStorage-based auth). */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface Slot {
  id: string;
  label: string;
  status: SlotStatus;
  startTime: string;
  endTime: string;
}

export interface Court {
  id: string;
  name: string;
  sport: SportType;
  featured: boolean;
  pricePerSlot: number;
  slots: Slot[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────
// Bookings (persisted in Supabase)
// ─────────────────────────────────────────────────────────────

export type BookingStatus =
  | "CONFIRMED" // deposit paid, upcoming
  | "COMPLETED" // customer showed up & played
  | "NO_SHOW" // customer didn't show → deposit forfeited
  | "CANCELLED"; // cancelled by user/admin

/** A booking row as stored in Supabase (snake_case columns mapped to camelCase). */
export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  courtId: string;
  courtName: string;
  sport: SportType;
  slotLabel: string;
  bookingDate: string; // ISO date (yyyy-mm-dd) of the session
  startTime: string; // ISO datetime
  reference: string; // e.g. CRT-8F3K
  total: number;
  deposit: number;
  balance: number;
  promoCode: string | null;
  status: BookingStatus;
  createdAt: string;
}

/** A pending booking draft kept in sessionStorage between grid → checkout. */
export interface BookingDraft {
  courtId: string;
  courtName: string;
  sport: SportType;
  slotId: string;
  slotLabel: string;
  bookingDate: string; // yyyy-mm-dd
  startTime: string; // ISO datetime
  pricePerSlot: number;
}

/** A simple star review for a court (persisted in Supabase). */
export interface Review {
  id: string;
  courtId: string;
  userId: string;
  userName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

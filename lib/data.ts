// ─────────────────────────────────────────────────────────────────────────────
// Static demo data (no database).
//
// This replaces the old Prisma/Neon backend + seed script. The app is now a
// purely static site: courts, slots, and equipment are defined here and the
// booking/cart interactions happen entirely in the browser.
// ─────────────────────────────────────────────────────────────────────────────

import type { Court, Equipment, Slot } from "./types";

const OPEN_HOUR = 10; // 10:00
const CLOSE_HOUR = 22; // last slot 21:00–22:00

/** Format a Date as yyyy-mm-dd (local). */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Build the hourly slot grid (10:00 → 22:00) for a specific court and date.
 * Statuses here are only "AVAILABLE" — real BOOKED status comes from Supabase.
 */
export function buildSlots(courtId: string, date: Date): Slot[] {
  const slots: Slot[] = [];
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  let i = 0;
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    const startTime = new Date(base);
    startTime.setHours(hour);
    const endTime = new Date(base);
    endTime.setHours(hour + 1);

    const label = `${String(hour).padStart(2, "0")}:00 - ${String(
      hour + 1,
    ).padStart(2, "0")}:00`;

    slots.push({
      id: `${courtId}-${toDateKey(date)}-${i}`,
      label,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: "AVAILABLE",
    });
    i++;
  }
  return slots;
}

/** Court metadata. Slots are built on demand per date via `buildSlots`. */
export interface CourtInfo {
  id: string;
  name: string;
  sport: Court["sport"];
  pricePerSlot: number;
  description: string;
  imageUrl: string;
}

/** Featured courts: Padel 1 & 2, Badminton 1 & 2. */
export const COURTS: CourtInfo[] = [
  {
    id: "padel-1",
    name: "Padel Court 1",
    sport: "PADEL",
    pricePerSlot: 150000,
    description: "Panoramic glass-walled padel court with pro cushioned turf.",
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
  },
  {
    id: "padel-2",
    name: "Padel Court 2",
    sport: "PADEL",
    pricePerSlot: 150000,
    description: "Covered padel court, floodlit for evening Mabar sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
  },
  {
    id: "badminton-1",
    name: "Badminton Court 1",
    sport: "BADMINTON",
    pricePerSlot: 80000,
    description: "BWF-spec wooden sprung floor with anti-glare lighting.",
    imageUrl:
      "https://images.unsplash.com/photo-1613918431703-aa50889e3be9?w=800&q=80",
  },
  {
    id: "badminton-2",
    name: "Badminton Court 2",
    sport: "BADMINTON",
    pricePerSlot: 80000,
    description: "Air-conditioned hall, premium mats, zero draft.",
    imageUrl:
      "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800&q=80",
  },
];

/** Sport-store equipment catalog. */
export const EQUIPMENT: Equipment[] = [
  {
    id: "eq-1",
    name: "Pro Padel Racket",
    category: "Rackets",
    description:
      "Carbon-fiber padel racket with EVA soft core. Great control and power.",
    price: 1250000,
    stock: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80",
  },
  {
    id: "eq-2",
    name: "Badminton Racket (Lightweight)",
    category: "Rackets",
    description:
      "4U graphite badminton racket, 83g. Fast swing and head balance.",
    price: 680000,
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1613918431703-aa50889e3be9?w=600&q=80",
  },
  {
    id: "eq-3",
    name: "Feather Shuttlecocks (Tube of 12)",
    category: "Shuttlecocks",
    description: "Tournament-grade goose-feather shuttlecocks. Speed 77.",
    price: 185000,
    stock: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=600&q=80",
  },
  {
    id: "eq-4",
    name: "Overgrip Tape (Pack of 3)",
    category: "Accessories",
    description:
      "Sweat-absorbing anti-slip overgrips. Fits padel and badminton rackets.",
    price: 75000,
    stock: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80",
  },
  {
    id: "eq-5",
    name: "Padel Balls (Can of 3)",
    category: "Accessories",
    description:
      "Pressurized padel balls with consistent bounce. Official match spec.",
    price: 95000,
    stock: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
  },
  {
    id: "eq-6",
    name: "Sports Wristband (Pair)",
    category: "Accessories",
    description:
      "Breathable cotton-blend wristbands. Keeps grip dry during long Mabar sessions.",
    price: 55000,
    stock: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
];

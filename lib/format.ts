// Formatting helpers shared across client components.

/** Format a number as Indonesian Rupiah, e.g. 150000 → "Rp 150.000". */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

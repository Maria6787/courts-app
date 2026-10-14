"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { COURTS, type CourtInfo } from "@/lib/data";
import { addReview, getReviews } from "@/lib/bookings";
import { formatIDR } from "@/lib/format";
import type { Review } from "@/lib/types";

export function CourtsShowcase() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState<CourtInfo | null>(null);

  const load = async () => {
    try {
      setReviews(await getReviews());
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const statsFor = (courtId: string) => {
    const rs = reviews.filter((r) => r.courtId === courtId);
    const avg = rs.length
      ? rs.reduce((s, r) => s + r.rating, 0) / rs.length
      : 0;
    return { count: rs.length, avg };
  };

  return (
    <section id="courts" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-black sm:text-4xl">Our Courts</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Premium padel and badminton courts, rated by the community.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {COURTS.map((court) => {
          const { count, avg } = statsFor(court.id);
          return (
            <div
              key={court.id}
              className="glass group flex flex-col overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {court.sport === "PADEL" ? "🎾 Padel" : "🏸 Badminton"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-bold">{court.name}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">
                  {court.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">
                    {avg ? avg.toFixed(1) : "New"}
                  </span>
                  <span className="text-slate-400">
                    {count > 0 ? `(${count})` : ""}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-black">
                    {formatIDR(court.pricePerSlot)}
                    <span className="text-xs font-normal text-slate-400">
                      /hr
                    </span>
                  </span>
                  <button
                    onClick={() => setOpen(court)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <ReviewModal
          court={open}
          reviews={reviews.filter((r) => r.courtId === open.id)}
          onClose={() => setOpen(null)}
          onAdded={async () => {
            await load();
          }}
        />
      )}
    </section>
  );
}

function ReviewModal({
  court,
  reviews,
  onClose,
  onAdded,
}: {
  court: CourtInfo;
  reviews: Review[];
  onClose: () => void;
  onAdded: () => Promise<void>;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!user) {
      setError("Please log in to leave a review.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short comment.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await addReview({
        courtId: court.id,
        userId: user.id,
        userName: user.name,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      await onAdded();
    } catch {
      setError("Could not submit review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="glass relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-200/60 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold">{court.name} — Reviews</h3>

        {/* Add review */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
              >
                <Star
                  className={`h-6 w-6 ${
                    n <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              user ? "Share your experience…" : "Log in to leave a review"
            }
            disabled={!user}
            rows={2}
            className="w-full rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          <button
            onClick={submit}
            disabled={saving || !user}
            className="brand-gradient mt-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Posting…" : "Post review"}
          </button>
        </div>

        {/* List */}
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No reviews yet. Be the first!
            </p>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.userName}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {r.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

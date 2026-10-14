"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300">
            <Users className="h-4 w-4" />
            Optimized for Mabar (Main Bareng)
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Book your{" "}
            <span className="brand-text-gradient">Padel & Badminton</span> court
            in seconds.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Courts is the modern way to rent sports courts and gear up. Live
            availability, crash-proof booking, and a built-in sport store — all
            in one sleek place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#booking"
              className="brand-gradient flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Book a Court
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#store"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Browse the store
            </Link>
          </div>

          {/* Feature chips */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Lightning fast",
                desc: "Real-time slot availability.",
              },
              {
                icon: ShieldCheck,
                title: "Crash-proof",
                desc: "Atomic double-booking guard.",
              },
              {
                icon: Users,
                title: "Built for groups",
                desc: "Mabar sessions made easy.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-5 text-left">
                <Icon className="h-6 w-6 text-brand-500" />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

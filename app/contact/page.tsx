"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated submission.
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Contact Us</h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Questions about bookings or equipment? Get in touch.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details */}
        <div className="space-y-4">
          <Info icon={MapPin} label="Address">
            Jl. Olahraga No. 1, Jakarta Selatan, Indonesia
          </Info>
          <Info icon={Phone} label="Phone">
            +62 21 1234 5678
          </Info>
          <Info icon={Mail} label="Email">
            hello@courts.example
          </Info>
          <Info icon={Clock} label="Opening hours">
            Daily · 10:00 – 22:00
          </Info>
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-6">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/20 text-2xl">
                ✓
              </div>
              <h2 className="text-xl font-bold">Message sent!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Thanks {name || "there"} — we&apos;ll get back to you soon
                (simulated).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/70"
              />
              <button
                type="submit"
                className="brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass flex items-start gap-3 rounded-2xl p-4">
      <span className="brand-gradient flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>
      </div>
    </div>
  );
}

import { Dumbbell, Target, Users, Zap } from "lucide-react";

export const metadata = { title: "About — Courts" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <span className="brand-gradient mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg">
        <Dumbbell className="h-6 w-6" />
      </span>
      <h1 className="mb-3 text-3xl font-black">About Courts</h1>
      <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Courts is the modern way to rent padel and badminton courts for your
        next <strong>Mabar</strong> (Main Bareng) session. We make booking fast,
        transparent, and group-friendly — with live availability, fair deposit
        rules, and a built-in sport store so you&apos;re always game-ready.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Fast", desc: "Book an open slot in seconds." },
          {
            icon: Users,
            title: "Group-first",
            desc: "Designed for Mabar sessions.",
          },
          {
            icon: Target,
            title: "Fair",
            desc: "Clear deposits & cancellation rules.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass rounded-2xl p-5">
            <Icon className="h-6 w-6 text-brand-500" />
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

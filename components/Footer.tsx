import Link from "next/link";
import { Clock, Dumbbell, Mail, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-slate-200 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="text-xl font-black">Courts</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Sewa Lapangan & Sport Store. Book padel & badminton courts for your
            next Mabar session.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <FooterLink href="/#booking">Book a court</FooterLink>
            <FooterLink href="/#store">Sport store</FooterLink>
            <FooterLink href="/bookings">My bookings</FooterLink>
            <FooterLink href="/about">About</FooterLink>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Help
          </h3>
          <ul className="space-y-2 text-sm">
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/policies">Policies</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Visit us
          </h3>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              Jl. Olahraga No. 1, Jakarta Selatan
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              Daily · 10:00 – 22:00
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              hello@courts.example
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {year} Courts — Sewa Lapangan & Sport Store. Built for Mabar.
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        {children}
      </Link>
    </li>
  );
}

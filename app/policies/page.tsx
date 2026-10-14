import { ShieldCheck } from "lucide-react";
import { POLICY } from "@/lib/policy";

export const metadata = { title: "Policies — Courts" };

export default function PoliciesPage() {
  const depositPct = Math.round(POLICY.DEPOSIT_RATE * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-black">
        <ShieldCheck className="h-7 w-7 text-brand-500" />
        Booking Policies
      </h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Please read these rules before booking. By paying a deposit you agree to
        them.
      </p>

      <div className="space-y-6">
        <Section title={`${depositPct}% Deposit to confirm`}>
          Every court booking requires a <strong>{depositPct}% deposit</strong>{" "}
          paid online at checkout. The remaining {100 - depositPct}% balance is
          paid at the venue when you arrive. Your slot is only reserved once the
          deposit is paid.
        </Section>

        <Section title="No-show policy">
          If you do not show up for your booking, it is marked as a{" "}
          <strong>no-show</strong> and your deposit (half of the total) is{" "}
          <strong>forfeited</strong>. The remaining balance is waived — you are
          not charged further.
        </Section>

        <Section title="Cancellation policy">
          You may cancel for{" "}
          <strong>free up to {POLICY.FREE_CANCEL_HOURS} hours</strong> before
          your start time, and your deposit is refunded (simulated). If you
          cancel <strong>within {POLICY.FREE_CANCEL_HOURS} hours</strong> of the
          start time, the deposit is forfeited.
        </Section>

        <Section title="Booking window">
          Courts can be booked up to{" "}
          <strong>{POLICY.MAX_ADVANCE_DAYS} days</strong> in advance. Bookings
          must be made at least <strong>{POLICY.MIN_NOTICE_HOURS} hour</strong>{" "}
          before the slot starts. Past slots cannot be booked.
        </Section>

        <Section title="One booking per slot">
          Each court time slot can only be booked once. If someone reserves a
          slot before you complete payment, you&apos;ll be asked to pick another
          time.
        </Section>

        <Section title="Payments">
          Payments on this site are <strong>simulated</strong> for demonstration
          — no real card is charged.
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <p className="leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </div>
  );
}

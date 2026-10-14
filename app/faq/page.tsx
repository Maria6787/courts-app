import { HelpCircle } from "lucide-react";
import { POLICY } from "@/lib/policy";

export const metadata = { title: "FAQ — Courts" };

const FAQS = [
  {
    q: "How do I book a court?",
    a: "Create an account or log in, pick a date and an open time slot on the booking grid, review your summary, and pay the deposit to confirm.",
  },
  {
    q: "How much deposit do I pay?",
    a: `A ${Math.round(POLICY.DEPOSIT_RATE * 100)}% deposit is paid online now. The remaining balance is paid at the venue when you arrive.`,
  },
  {
    q: "Can I cancel my booking?",
    a: `Yes. Cancel for free up to ${POLICY.FREE_CANCEL_HOURS} hours before your start time for a deposit refund. Within ${POLICY.FREE_CANCEL_HOURS} hours, the deposit is forfeited.`,
  },
  {
    q: "What happens if I don't show up?",
    a: "No-shows forfeit the deposit (half the total). The remaining balance is waived.",
  },
  {
    q: "How far ahead can I book?",
    a: `Up to ${POLICY.MAX_ADVANCE_DAYS} days in advance, and at least ${POLICY.MIN_NOTICE_HOURS} hour before the slot starts.`,
  },
  {
    q: "Do you rent equipment?",
    a: "Yes — browse the Sport Store on the home page for rackets, shuttlecocks, balls, and accessories.",
  },
  {
    q: "Is my payment real?",
    a: "No. Payments here are simulated for demonstration purposes and no real card is charged.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-black">
        <HelpCircle className="h-7 w-7 text-brand-500" />
        Frequently Asked Questions
      </h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Everything you need to know about booking at Courts.
      </p>

      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="glass group rounded-2xl p-5 [&_summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between font-semibold">
              {f.q}
              <span className="text-brand-500 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

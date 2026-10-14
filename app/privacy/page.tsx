export const metadata = { title: "Privacy Policy — Courts" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Privacy Policy</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="space-y-6 leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          This demonstration app values your privacy. This policy explains what
          we store and why.
        </p>
        <Clause n="Information we collect">
          When you register we store your name and email via our authentication
          provider (Supabase). When you book, we store the booking details
          (court, date, time, deposit amount, reference) linked to your account.
        </Clause>
        <Clause n="How we use it">
          Your data is used only to provide the booking service — managing your
          reservations and showing them to you and venue administrators.
        </Clause>
        <Clause n="Payments">
          Payments are simulated. We do not collect, process, or store real card
          numbers; the card fields at checkout are for demonstration only.
        </Clause>
        <Clause n="Data retention & deletion">
          You can cancel bookings at any time. Administrators can clear booking
          data, and you may request deletion of your account and associated
          data.
        </Clause>
        <Clause n="Contact">
          Questions about privacy? Reach us via the Contact page.
        </Clause>
      </div>
    </div>
  );
}

function Clause({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1 font-bold text-slate-900 dark:text-slate-100">{n}</h2>
      <p>{children}</p>
    </div>
  );
}

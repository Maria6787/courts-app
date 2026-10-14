export const metadata = { title: "Terms of Service — Courts" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-black">Terms of Service</h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="space-y-6 leading-relaxed text-slate-600 dark:text-slate-300">
        <p>
          Welcome to Courts. By using this website and booking a court, you
          agree to these terms. This is a demonstration application; payments
          are simulated and no real transactions occur.
        </p>
        <Clause n="1. Accounts">
          You are responsible for keeping your login credentials secure and for
          all activity under your account. Provide accurate information when
          registering.
        </Clause>
        <Clause n="2. Bookings & Payments">
          Bookings require a deposit at checkout. Deposit, cancellation, and
          no-show rules are described on the Policies page and form part of
          these terms.
        </Clause>
        <Clause n="3. Acceptable Use">
          You agree not to misuse the service, attempt to disrupt it, or book
          fraudulently. We may suspend accounts that violate these terms.
        </Clause>
        <Clause n="4. Limitation of Liability">
          The service is provided &quot;as is&quot; for demonstration purposes
          without warranties of any kind.
        </Clause>
        <Clause n="5. Changes">
          We may update these terms from time to time. Continued use after
          changes constitutes acceptance.
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

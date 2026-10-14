# 🏟️ Courts — Sewa Lapangan & Sport Store

A genuine, full-featured sports court **booking platform**. Book **Padel** and
**Badminton** courts for your next *Mabar* (Main Bareng) session with real
accounts, a deposit-based payment flow, enforced booking rules, a sport store,
and an admin dashboard.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**. Accounts,
bookings, and reviews are persisted in **Supabase**. Payments are **simulated**
(no real card is charged). Deploys to **Vercel**.

---

## ✨ Features

**Booking**
- 🔐 **Login required to book** — not signed in? You're sent to login/sign-up.
- 📅 **Date picker + sport filter** — browse open slots up to 14 days ahead.
- 💳 **Deposit checkout** — review summary, apply a promo code, accept the policy, pay a **50% deposit** (simulated). Confirmation page with a booking reference.
- 📜 **Enforced rules** — 50% deposit, 24h free-cancel window, no-show forfeits the deposit, 14-day advance limit, 1h minimum notice, no past/double bookings.
- 🎫 **My Bookings** — upcoming/past list with status (Confirmed / Completed / No-show / Cancelled) and cancel.

**Admin** (the account whose email = `NEXT_PUBLIC_ADMIN_EMAIL`)
- 🛡️ **Dashboard** at `/admin` — every booking, mark **No-show** / **Completed**, and analytics (totals, deposits collected, no-show rate).
- 🧹 **Clear all bookings** button to free database storage anytime.

**Store & more**
- 🛒 **Sport store** — searchable, category-filtered catalog, cart drawer, dummy "Payment Successful".
- ⭐ **Court reviews & ratings** — leave and read reviews per court.
- 👤 **Profile** — edit your name, view payment history.
- 📄 **Policies / FAQ / Terms / Privacy / About / Contact** pages + rich footer.
- 🌗 **Dark / light mode**, glassmorphic UI, fully responsive with a mobile menu.

---

## 🧱 Tech Stack

| Layer | Choice |
|------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Lucide icons |
| Auth & DB | **Supabase** (accounts, bookings, reviews) |
| Payments | Simulated (demo) |
| State | React Context + `localStorage` |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Open **Project Settings → API** and copy the **Project URL** and **anon public** key.

### 3. Create the database tables
In Supabase → **SQL Editor** → **New query**, paste the entire contents of
[`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql) and click **Run**. This creates the
`bookings` and `reviews` tables with security rules (users see only their own
bookings; the admin sees all).

> If you change the admin email, update it in **both** `.env.local`
> (`NEXT_PUBLIC_ADMIN_EMAIL`) **and** the `is_admin()` function in the SQL.

### 4. Configure environment variables
Copy `.env.example` → `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
NEXT_PUBLIC_ADMIN_EMAIL="applicationdevelopmentincloud@gmail.com"
```

> **Demo tip:** In Supabase → **Authentication → Providers → Email**, turn
> **"Confirm email" OFF** so sign-ups log in instantly.

### 5. Run it
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). Register with the admin
email above to get admin access; register with any other email for a normal
user.

---

## ☁️ Deploy to Vercel
1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add the three env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EMAIL`) under **Project Settings → Environment Variables**.
4. **Deploy.**

---

## 🧹 Freeing storage / wiping demo data
Three easy ways:
- In-app: log in as admin → `/admin` → **Clear all bookings**.
- SQL: Supabase → SQL Editor → `truncate table public.bookings;`
- Delete accounts: Supabase → **Authentication → Users**.

Each booking row is tiny; Supabase's free tier (500 MB) holds hundreds of
thousands of them.

---

## 📂 Project Structure
```
app/
  page.tsx                   # home: hero + courts + booking grid + store
  checkout/page.tsx          # simulated deposit payment
  booking/confirmed/page.tsx # confirmation + reference
  bookings/page.tsx          # My Bookings (cancel)
  admin/page.tsx             # admin dashboard + analytics + clear-all
  profile/page.tsx           # edit name, payment history
  login / register           # Supabase auth
  policies / faq / terms / privacy / about / contact
components/
  BookingGrid · CourtsShowcase · EquipmentStore · CartDrawer
  Navbar · Footer · Hero · ThemeToggle
context/
  AuthContext · ThemeContext · CartContext
lib/
  supabase.ts   # Supabase client
  bookings.ts   # booking & review queries
  policy.ts     # all booking rules (edit numbers here)
  data.ts       # static courts, slots, equipment
  draft.ts · format.ts · types.ts
SUPABASE_SETUP.sql           # run once in Supabase
```

---

Built for Mabar. 🏸🎾

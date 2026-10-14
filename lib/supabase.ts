import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// Supabase browser client.
//
// Supabase handles the entire auth system (accounts, sessions, hashing).
// These two values are safe to expose to the browser — they are the public
// project URL and the "anon" (publishable) key. Set them in `.env.local` and
// in your Vercel project's Environment Variables.
// ─────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced at runtime so misconfiguration is obvious during local dev.
  // eslint-disable-next-line no-console
  console.warn(
    "[Courts] Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local (and on Vercel).",
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

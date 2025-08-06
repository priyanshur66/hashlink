// Mark this module as server-only to prevent importing from the client
import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL in environment");
}
if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY in environment");
}

// Server-side only client. Do not import this into client components.
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
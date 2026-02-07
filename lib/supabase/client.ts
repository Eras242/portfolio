import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both variable names for the anon key
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) {
    missingVars.push(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)"
    );
  }

  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(", ")}\n` +
      `Please check your .env.local file and ensure:\n` +
      `1. Variables are prefixed with NEXT_PUBLIC_\n` +
      `2. No quotes around the values\n` +
      `3. Dev server has been restarted after adding/changing .env.local\n` +
      `4. File is named exactly .env.local (not .env or .env.local.txt)`
  );
}

// Create a single supabase client for interacting with your database
// TypeScript assertion: we've already checked these are defined above
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

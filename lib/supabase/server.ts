import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both variable names for the anon key
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)");
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

// Create a server-side supabase client with cookie-based authentication
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

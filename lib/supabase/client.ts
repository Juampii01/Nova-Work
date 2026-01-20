import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env faltantes. Asegurate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local y reiniciar el dev server."
    )
  }

  return { url, anonKey }
}

/**
 * Universal Supabase client:
 * - Browser: singleton via createClient (supports auth/session)
 * - Server (SSR/RSC): non-persistent supabase-js client
 */
export function createClient(): SupabaseClient {
  const { url, anonKey } = requireEnv()

  // Browser or Server - use same simple client
  if (typeof window !== "undefined") {
    // Browser: create singleton with session persistence
    if (!browserClient) {
      browserClient = createSupabaseClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    }
    return browserClient
  }

  // Server / SSR / RSC: new client for each request
  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (!code) {
    // Si no hay code, redirigir al login
    return NextResponse.redirect(`${origin}/auth`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[Auth Callback] Error exchanging code:", error)
      return NextResponse.redirect(`${origin}/auth`)
    }
  } catch (err) {
    console.error("[Auth Callback] Unexpected error:", err)
    return NextResponse.redirect(`${origin}/auth`)
  }

  // Redirect exitoso al feed
  return NextResponse.redirect(`${origin}/feed`)
}

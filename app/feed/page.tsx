import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"

// Importa el Client Component de forma dinámica para evitar SSR
const FeedClient = dynamic(() => import("./FeedClient"), { ssr: false })

export default async function FeedPage() {
  // Validar sesión en el server
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth")
  }
  // Renderiza el Client Component
  return <FeedClient />
}

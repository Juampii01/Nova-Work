"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  username?: string
  full_name?: string
  email?: string
  avatar_url?: string
  role?: "recruiter" | "candidate" | "admin"
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refetch: () => Promise<void>
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  const fetchUserData = async () => {
    try {
      const supabase = createClient()
      if (!supabase) {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user || null)

      if (user && user.id) {
        // Fetch user profile correctamente: .single() y manejo de error
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, full_name, email, avatar_url, role")
          .eq("id", user.id)
          .single()
        if (profileError) {
          console.error("[useAuth] Error al cargar perfil:", profileError)
        }
        setProfile(profileData || { id: user.id, email: user.email })
      } else {
        setProfile(null)
      }
    } catch (error) {
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Forzar refresco de usuario en cada cambio de ruta
    setIsLoading(true)
    fetchUserData().finally(() => setIsLoading(false))

    // Suscribirse a cambios de sesión de Supabase
    const supabase = createClient()
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user && session.user.id) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, full_name, email, avatar_url, role")
          .eq("id", session.user.id)
          .single()
        if (profileError) {
          console.error("[useAuth] Error al cargar perfil (onAuthStateChange):", profileError)
        }
        setProfile(profileData || { id: session.user.id, email: session.user.email })
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })
    return () => {
      subscription?.unsubscribe()
    }
  }, [pathname])

  const signOut = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return

      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      // Error handling
    }
  }

  const refetch = async () => {
    await fetchUserData()
  }

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refetch,
  }
}

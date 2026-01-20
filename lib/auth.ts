"use client"
import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_verified: boolean
  premium_tier: "free" | "plus" | "pro"
  location?: {
    lat: number
    lng: number
    address: string
  }
  created_at: Date
}

// Get current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) return null

  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    is_verified: profile.is_verified,
    premium_tier: profile.premium_tier || "free",
    created_at: new Date(profile.created_at),
  }
}

// Logout user
export const logout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

// Update user profile
export const updateProfile = async (userId: string, updates: Partial<User>) => {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

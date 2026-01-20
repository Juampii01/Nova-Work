"use client"

import { createClient } from "@/lib/supabase/client"

export async function uploadAvatar(file: File, userId: string) {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { data, error } = await supabase.storage.from("profiles").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) {
    console.error("[v0] Error uploading avatar:", error)
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(filePath)

  return publicUrl
}

export async function uploadPortfolioFile(file: File, userId: string) {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `portfolio/${fileName}`

  const { data, error } = await supabase.storage.from("profiles").upload(filePath, file)

  if (error) {
    console.error("[v0] Error uploading portfolio file:", error)
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(filePath)

  return publicUrl
}

export async function deleteFile(filePath: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from("profiles").remove([filePath])

  if (error) {
    console.error("[v0] Error deleting file:", error)
    throw error
  }

  return true
}

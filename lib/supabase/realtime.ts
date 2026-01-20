"use client"

import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export async function subscribeToMessages(
  conversationId: string,
  callback: (message: any) => void,
): Promise<RealtimeChannel> {
  const supabase = createClient()
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  return channel
}

export async function subscribeToNotifications(
  userId: string,
  callback: (notification: any) => void,
): Promise<RealtimeChannel> {
  const supabase = createClient()
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  return channel
}

export async function subscribeToJobUpdates(category: string, callback: (job: any) => void): Promise<RealtimeChannel> {
  const supabase = createClient()
  const channel = supabase
    .channel(`jobs:${category}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "jobs",
        filter: `category=eq.${category}`,
      },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  return channel
}

// Unsubscribe from channel
export function unsubscribeFromChannel(channel: RealtimeChannel) {
  channel.unsubscribe()
}

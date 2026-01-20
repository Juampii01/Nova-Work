"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, X, User, Briefcase, Star, Calendar, MessageCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavDropdown } from "@/components/nav-dropdown-context"
import { createClient } from "@/lib/supabase/client"

interface Notification {
  id: string
  type: "job_match" | "message" | "review" | "event" | "achievement" | "connection"
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  avatar?: string
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "job_match":
      return <Briefcase className="h-4 w-4 text-nova-accent" />
    case "message":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "review":
      return <Star className="h-4 w-4 text-yellow-500" />
    case "event":
      return <Calendar className="h-4 w-4 text-purple-500" />
    case "achievement":
      return <Award className="h-4 w-4 text-orange-500" />
    case "connection":
      return <User className="h-4 w-4 text-green-500" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Ahora"
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const loadNotifications = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!data) return

      const formatted = data.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.content,
        timestamp: new Date(n.created_at),
        read: n.is_read,
        actionUrl: n.link_url,
      }))

      setNotifications(formatted)
    }

    loadNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date() })
      .eq("id", id)

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date() })
      .eq("is_read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const { open, setOpen } = useNavDropdown()

  useEffect(() => {
    if (open !== "notifications") return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(null)
      }
    }

    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [open, setOpen])

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setOpen(open === "notifications" ? null : "notifications")}
        aria-haspopup="menu"
        aria-expanded={open === "notifications"}
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {open === "notifications" && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-popover shadow-md z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground">({unreadCount} nuevas)</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Marcar todo
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(null)}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No tenés notificaciones.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-3 py-2 border-b border-border last:border-b-0 flex gap-3 ${
                    n.read ? "bg-transparent" : "bg-muted/30"
                  }`}
                >
                  <div className="mt-0.5">{getNotificationIcon(n.type)}</div>

                  <button
                    className="flex-1 text-left"
                    onClick={() => {
                      markAsRead(n.id)
                      setOpen(null)
                      if (n.actionUrl) router.push(n.actionUrl)
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium leading-tight">{n.title}</div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {formatTimeAgo(n.timestamp)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.description}
                    </div>
                  </button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(n.id)
                    }}
                    aria-label="Eliminar notificación"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="px-3 py-2 border-t border-border">
            <Link
              href="/settings"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(null)}
            >
              Gestionar notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

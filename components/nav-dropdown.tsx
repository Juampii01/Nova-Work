"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavDropdown } from "@/components/nav-dropdown-context"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Check } from "lucide-react"

function NotificationsContent() {
  return (
    <div className="w-80 p-4 space-y-3">
      <h4 className="text-sm font-semibold">Notificaciones</h4>
      <div className="text-sm text-muted-foreground">
        No tenés notificaciones nuevas
      </div>
    </div>
  )
}

function ThemeContent() {
  const { theme, setTheme } = useTheme()

  const options = [
    { key: "light", label: "Claro", icon: Sun },
    { key: "dark", label: "Oscuro", icon: Moon },
    { key: "system", label: "Sistema", icon: Monitor },
  ]

  return (
    <div className="w-48 p-2 space-y-1">
      {options.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setTheme(key)}
        >
          <Icon className="h-4 w-4" />
          {label}
          {theme === key && <Check className="ml-auto h-4 w-4" />}
        </Button>
      ))}
    </div>
  )
}

import Link from "next/link"
import {
  Sparkles,
  BarChart3,
  FileText,
  ShoppingBag,
  Calendar,
  Users,
  Trophy,
  Settings,
  HelpCircle,
} from "lucide-react"

function MoreMenuContent() {
  const { setOpen } = useNavDropdown()

  const close = () => setOpen(null)

  return (
    <div className="w-56 p-1 space-y-1">
      <Link
        href="/recommendations"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <Sparkles className="h-4 w-4" />
        Recomendaciones
      </Link>

      <Link
        href="/dashboard"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <BarChart3 className="h-4 w-4" />
        Analytics
      </Link>

      <Link
        href="/portfolio"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <FileText className="h-4 w-4" />
        Portfolio
      </Link>

      <div className="my-1 h-px bg-border" />

      <Link
        href="/marketplace"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <ShoppingBag className="h-4 w-4" />
        Marketplace
      </Link>

      <Link
        href="/events"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <Calendar className="h-4 w-4" />
        Eventos
      </Link>

      <Link
        href="/groups"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <Users className="h-4 w-4" />
        Grupos
      </Link>

      <Link
        href="/achievements"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <Trophy className="h-4 w-4" />
        Logros
      </Link>

      <div className="my-1 h-px bg-border" />

      <Link
        href="/settings"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <Settings className="h-4 w-4" />
        Configuración
      </Link>

      <Link
        href="/help"
        onClick={close}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
      >
        <HelpCircle className="h-4 w-4" />
        Ayuda
      </Link>
    </div>
  )
}

export function NavDropdown({
  children,
}: {
  children?: React.ReactNode
}) {
  const { open, setOpen } = useNavDropdown()

  return (
    <DropdownMenu
      open={!!open}
      onOpenChange={(value) => {
        if (!value) setOpen(null)
      }}
    >
      <DropdownMenuTrigger asChild>
        {children ?? <span />}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[100]"
      >
        {open === "notifications" && <NotificationsContent />}
        {open === "theme" && <ThemeContent />}
        {open === "more" && <MoreMenuContent />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNavDropdown } from "@/components/nav-dropdown-context"
import { NavDropdown } from "@/components/nav-dropdown"
import { Search, Plus, MessageCircle, User, Menu, X, MoreHorizontal, LogOut, BarChart3 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import NotificationsCenter from "./notifications-center"
import { ThemeToggle } from "./theme-toggle"
import { GlobalSearch } from "./global-search"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { open, setOpen } = useNavDropdown()
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")
  const profileLink = profile?.username ? `/u/${profile.username}` : (user?.id ? `/settings` : "/auth")

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      toast.success("Sesión cerrada")
      router.push("/auth")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  return (
    <nav className="relative sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground hidden lg:block">Nova Work</span>
          </Link>

          {/* Global Search */}
          <div className="hidden md:flex flex-1 max-w-none mx-4 lg:mx-12">
            <div className="w-full max-w-3xl mx-auto">
              <GlobalSearch />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 shrink-0">
            <Link
              href="/feed"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition-colors duration-200 ${
                isActive("/feed")
                  ? "text-foreground font-bold bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Explorar</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/post"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition-colors duration-200 ${
                    isActive("/post")
                      ? "text-foreground font-bold bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Publicar</span>
                </Link>

                <Link
                  href="/messages"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition-colors duration-200 ${
                    isActive("/messages")
                      ? "text-foreground font-bold bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Mensajes</span>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => setOpen(open === "more" ? null : "more")}
              aria-label="Más opciones"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {isAuthenticated && <NotificationsCenter />}
            <ThemeToggle />

            {/* User Menu or Login Button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative transition-all duration-200 hover:scale-105"
                  aria-label="Menú de usuario"
                  disabled={isLoading}
                >
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent border border-accent/30">
                    {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{profile?.full_name || profile?.username || user?.email || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || "Sin email"}</p>
                    </div>

                    <Link href={profileLink} className="block px-4 py-2 hover:bg-muted transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center space-x-2 text-sm text-foreground">
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </div>
                    </Link>

                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-muted transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center space-x-2 text-sm text-foreground">
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors border-t border-border"
                    >
                      <div className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700">
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth">
                <Button size="sm" variant="outline" className="bg-accent/10 hover:bg-accent/20">
                  Ingresar
                </Button>
              </Link>
            )}

            {(open === "more" || open === "theme") && <NavDropdown />}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-300">
            <div className="mb-4 w-full">
              <GlobalSearch />
            </div>

            <div className="flex flex-col space-y-3">
              <Link
                href="/feed"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/feed")
                    ? "text-foreground font-bold bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Explorar</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/post"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/post")
                        ? "text-foreground font-bold bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar</span>
                  </Link>

                  <Link
                    href="/messages"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/messages")
                        ? "text-foreground font-bold bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mensajes</span>
                  </Link>

                  <Link
                    href={profileLink}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(profileLink)
                        ? "text-foreground font-bold bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive("/dashboard")
                        ? "text-foreground font-bold bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-muted w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              )}

              {!isLoading && !isAuthenticated && (
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Ingresar</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

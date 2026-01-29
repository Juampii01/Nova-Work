"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useNavDropdown } from "@/components/nav-dropdown-context"
import { NavDropdown } from "@/components/nav-dropdown"
import { Search, Plus, MessageCircle, User, Menu, X, MoreHorizontal, LogOut, BarChart3, Heart } from "lucide-react"
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
  const { user, isLoading, isAuthenticated, signOut } = useAuth()

  const isActive = (path: string) => pathname ? (pathname === path || pathname.startsWith(path + "/")) : false
  const profileLink = user?.id ? `/settings` : "/auth"

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
      <nav className="relative sticky top-0 z-40 bg-gradient-to-br from-accent/30 via-background/80 to-primary/20 backdrop-blur-2xl border-b border-border shadow-lg transition-all duration-300 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0 animate-fade-in-left">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-extrabold text-lg drop-shadow">N</span>
            </div>
            <span className="font-heading font-extrabold text-2xl text-foreground hidden lg:block tracking-tight bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-fade-in">Nova Work</span>
          </Link>

          {/* Global Search */}
          <div className="hidden md:flex flex-1 max-w-none mx-4 lg:mx-12 animate-fade-in">
            <div className="w-full max-w-3xl mx-auto">
              <GlobalSearch />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 shrink-0 animate-fade-in-right">
            <Link
              href="/feed"
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                isActive("/feed")
                  ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
              } animate-fade-in-up`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Explorar</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/post"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                    isActive("/post")
                      ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                  } animate-fade-in-up`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Publicar</span>
                </Link>

                <Link
                  href="/messages"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                    isActive("/messages")
                      ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                  } animate-fade-in-up`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Mensajes</span>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="px-2 rounded-xl hover:bg-accent/10 transition-all shadow-sm"
              onClick={() => setOpen(open === "more" ? null : "more")}
              aria-label="Más opciones"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {isAuthenticated && <NotificationsCenter />}
            <ThemeToggle />

            {/* User Menu o Login Button, Favoritos solo en avatar */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative transition-all duration-200 hover:scale-110 rounded-full shadow-md"
                  aria-label="Menú de usuario"
                  disabled={isLoading}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full flex items-center justify-center text-base font-extrabold text-accent border border-accent/30 shadow-inner">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-background/90 via-card/95 to-accent/10 border border-border rounded-2xl shadow-2xl z-50 py-2 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user?.email || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || "Sin email"}</p>
                    </div>

                    <Link href={profileLink} className="block px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center space-x-2 text-sm text-foreground">
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </div>
                    </Link>

                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center space-x-2 text-sm text-foreground">
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>

                    <Link href="/favorites" className="block px-4 py-2 hover:bg-accent/10 rounded-xl transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="flex items-center space-x-2 text-sm text-foreground">
                        <Heart className="w-4 h-4" />
                        <span>Favoritos</span>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors border-t border-border"
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
                <Button size="sm" variant="outline" className="bg-gradient-to-r from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 rounded-xl shadow-md">
                  Ingresar
                </Button>
              </Link>
            )}

            {(open === "more" || open === "theme") && <NavDropdown />}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2 animate-fade-in-right">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-accent/10 transition-all shadow-sm" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-gradient-to-br from-accent/20 via-background/80 to-primary/10 backdrop-blur-xl animate-fade-in-up rounded-b-2xl shadow-2xl">
            <div className="mb-4 w-full">
              <GlobalSearch />
            </div>

            <div className="flex flex-col space-y-3">
              <Link
                href="/feed"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                  isActive("/feed")
                    ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                } animate-fade-in-up`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Explorar</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/post"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                      isActive("/post")
                        ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                    } animate-fade-in-up`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar</span>
                  </Link>

                  <Link
                    href="/messages"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                      isActive("/messages")
                        ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                    } animate-fade-in-up`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mensajes</span>
                  </Link>

                  <Link
                    href={profileLink}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                      isActive(profileLink)
                        ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                    } animate-fade-in-up`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
                      isActive("/dashboard")
                        ? "text-foreground font-bold bg-accent/20 backdrop-blur-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:shadow-md"
                    } animate-fade-in-up`}
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 w-full animate-fade-in-up"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              )}

              {!isLoading && !isAuthenticated && (
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 shadow-md animate-fade-in-up">Ingresar</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

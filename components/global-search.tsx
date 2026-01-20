"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Briefcase, User, Calendar, FileText, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "job" | "user" | "event" | "service"
  title: string
  subtitle: string
  url: string
  badge?: string
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search function - replace with real API call
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockResults = [
      {
        id: "1",
        type: "job",
        title: "Desarrollador Frontend React",
        subtitle: "TechCorp • Buenos Aires • Remoto",
        url: "/job/1",
        badge: "Nuevo",
      },
      {
        id: "2",
        type: "user",
        title: "María González",
        subtitle: "Diseñadora UI/UX • 5 años exp.",
        url: "/u/mariagonzalez",
        badge: "Verificado",
      },
      {
        id: "3",
        type: "event",
        title: "Meetup de React Developers",
        subtitle: "15 Mar 2024 • Online",
        url: "/events",
      },
      {
        id: "4",
        type: "service",
        title: "Diseño de Logos Profesionales",
        subtitle: "Juan Pérez • Desde $50/hora",
        url: "/marketplace",
      },
    ] satisfies SearchResult[]

    const filteredResults = mockResults.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))

    setResults(filteredResults)
    setIsSearching(false)
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        setQuery("")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "service":
        return <FileText className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "job":
        return "Trabajo"
      case "user":
        return "Usuario"
      case "event":
        return "Evento"
      case "service":
        return "Servicio"
      default:
        return ""
    }
  }

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground bg-background/50 hover:bg-background h-11 px-4 shadow-sm border-muted-foreground/20 hover:border-muted-foreground/40 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-3 h-4 w-4 shrink-0" />
        <span className="flex-1 text-left font-normal">Buscar en Nova Work...</span>
        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <Card
            ref={searchRef}
            className="w-full max-w-2xl bg-background shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar trabajos, usuarios, eventos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!query && (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">Búsqueda rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Busca trabajos, usuarios, eventos y más en toda la plataforma
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="cursor-pointer">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Desarrollador
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Diseñador
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Marketing
                    </Badge>
                  </div>
                </div>
              )}

              {query && isSearching && (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-muted-foreground mt-4">Buscando...</p>
                </div>
              )}

              {query && !isSearching && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No se encontraron resultados</h3>
                  <p className="text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
                </div>
              )}

              {query && !isSearching && results.length > 0 && (
                <div className="p-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                      }}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{result.title}</p>
                            {result.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-accent/50 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-background rounded border">↑↓</kbd>
                  <span>Navegar</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd>
                  <span>Abrir</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-background rounded border">Esc</kbd>
                <span>Cerrar</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

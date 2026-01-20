"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Plus,
  Star,
  Share2,
  Bookmark,
  Video,
  Coffee,
  Briefcase,
  GraduationCap,
  Network,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  type: "networking" | "workshop" | "conference" | "meetup" | "webinar"
  category: string
  date: Date
  endDate?: Date
  location: {
    type: "online" | "offline" | "hybrid"
    address?: string
    venue?: string
    city: string
  }
  organizer: {
    name: string
    avatar?: string
    company?: string
    isVerified: boolean
  }
  attendees: {
    count: number
    max?: number
    confirmed: number
  }
  price: {
    type: "free" | "paid"
    amount?: number
    currency?: string
  }
  tags: string[]
  featured: boolean
  rating?: number
  image?: string
  isAttending?: boolean
  isBookmarked?: boolean
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Networking para Desarrolladores - Buenos Aires Tech",
    description:
      "Únete a la comunidad de desarrolladores más grande de Buenos Aires. Conecta con profesionales, comparte experiencias y descubre nuevas oportunidades laborales.",
    type: "networking",
    category: "Tecnología",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    location: {
      type: "offline",
      venue: "Centro Cultural Recoleta",
      address: "Junín 1930, Recoleta",
      city: "Buenos Aires",
    },
    organizer: {
      name: "Buenos Aires Tech",
      company: "Comunidad Tech",
      isVerified: true,
    },
    attendees: {
      count: 156,
      max: 200,
      confirmed: 142,
    },
    price: {
      type: "free",
    },
    tags: ["Networking", "Desarrollo", "Carrera"],
    featured: true,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=400&text=Tech+Networking",
  },
  {
    id: "2",
    title: "Workshop: Diseño UX/UI para Principiantes",
    description:
      "Aprende los fundamentos del diseño UX/UI en este workshop práctico. Incluye herramientas, metodologías y ejercicios hands-on.",
    type: "workshop",
    category: "Diseño",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    location: {
      type: "hybrid",
      venue: "Espacio Coworking Palermo",
      address: "Av. Córdoba 3000, Palermo",
      city: "Buenos Aires",
    },
    organizer: {
      name: "María Fernández",
      company: "UX Studio",
      isVerified: true,
    },
    attendees: {
      count: 45,
      max: 50,
      confirmed: 38,
    },
    price: {
      type: "paid",
      amount: 8500,
      currency: "ARS",
    },
    tags: ["UX", "UI", "Diseño", "Workshop"],
    featured: false,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=400&text=UX+Workshop",
  },
  {
    id: "3",
    title: "Conferencia: El Futuro del Trabajo Remoto",
    description:
      "Expertos internacionales comparten insights sobre tendencias, herramientas y mejores prácticas para el trabajo remoto.",
    type: "conference",
    category: "Carrera",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    location: {
      type: "online",
      city: "Virtual",
    },
    organizer: {
      name: "Remote Work Summit",
      company: "Global Events",
      isVerified: true,
    },
    attendees: {
      count: 1250,
      max: 2000,
      confirmed: 1180,
    },
    price: {
      type: "paid",
      amount: 15000,
      currency: "ARS",
    },
    tags: ["Remoto", "Futuro", "Carrera", "Conferencia"],
    featured: true,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=400&text=Remote+Work",
  },
  {
    id: "4",
    title: "Meetup: Emprendedores de Buenos Aires",
    description: "Encuentro mensual para emprendedores. Pitch sessions, networking y charlas inspiradoras.",
    type: "meetup",
    category: "Emprendimiento",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    location: {
      type: "offline",
      venue: "Hub de Innovación",
      address: "Av. Corrientes 1234, Centro",
      city: "Buenos Aires",
    },
    organizer: {
      name: "Startup Buenos Aires",
      company: "Comunidad Startup",
      isVerified: true,
    },
    attendees: {
      count: 89,
      max: 120,
      confirmed: 76,
    },
    price: {
      type: "free",
    },
    tags: ["Emprendimiento", "Startup", "Pitch"],
    featured: false,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=400&text=Startup+Meetup",
  },
  {
    id: "5",
    title: "Webinar: Marketing Digital para Freelancers",
    description:
      "Estrategias efectivas de marketing digital para freelancers. Desde personal branding hasta captación de clientes.",
    type: "webinar",
    category: "Marketing",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: {
      type: "online",
      city: "Virtual",
    },
    organizer: {
      name: "Carlos Rodríguez",
      company: "Marketing Pro",
      isVerified: true,
    },
    attendees: {
      count: 234,
      max: 500,
      confirmed: 198,
    },
    price: {
      type: "free",
    },
    tags: ["Marketing", "Freelance", "Digital"],
    featured: false,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=400&text=Marketing+Webinar",
  },
]

const eventTypes = [
  { value: "all", label: "Todos los eventos", icon: Calendar },
  { value: "networking", label: "Networking", icon: Network },
  { value: "workshop", label: "Workshops", icon: GraduationCap },
  { value: "conference", label: "Conferencias", icon: Briefcase },
  { value: "meetup", label: "Meetups", icon: Coffee },
  { value: "webinar", label: "Webinars", icon: Video },
]

const categories = ["Todas", "Tecnología", "Diseño", "Marketing", "Carrera", "Emprendimiento", "Finanzas"]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedPrice, setSelectedPrice] = useState("all")
  const [activeTab, setActiveTab] = useState("upcoming")

  const filteredEvents = events
    .filter((event) => {
      // Search filter
      if (
        searchQuery &&
        !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Type filter
      if (selectedType !== "all" && event.type !== selectedType) return false

      // Category filter
      if (selectedCategory !== "Todas" && event.category !== selectedCategory) return false

      // Location filter
      if (selectedLocation !== "all") {
        if (selectedLocation === "online" && event.location.type !== "online") return false
        if (selectedLocation === "offline" && event.location.type === "online") return false
      }

      // Price filter
      if (selectedPrice !== "all") {
        if (selectedPrice === "free" && event.price.type !== "free") return false
        if (selectedPrice === "paid" && event.price.type !== "paid") return false
      }

      // Tab filter
      const now = new Date()
      if (activeTab === "upcoming" && event.date < now) return false
      if (activeTab === "attending" && !event.isAttending) return false
      if (activeTab === "bookmarked" && !event.isBookmarked) return false

      return true
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return a.date.getTime() - b.date.getTime()
    })

  const handleAttendEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isAttending: !event.isAttending,
              attendees: {
                ...event.attendees,
                count: event.isAttending ? event.attendees.count - 1 : event.attendees.count + 1,
                confirmed: event.isAttending ? event.attendees.confirmed - 1 : event.attendees.confirmed + 1,
              },
            }
          : event,
      ),
    )
  }

  const handleBookmarkEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, isBookmarked: !event.isBookmarked } : event)),
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatPrice = (price: Event["price"]) => {
    if (price.type === "free") return "Gratis"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: price.currency || "ARS",
      minimumFractionDigits: 0,
    }).format(price.amount || 0)
  }

  const getLocationIcon = (type: Event["location"]["type"]) => {
    switch (type) {
      case "online":
        return <Video className="h-4 w-4" />
      case "hybrid":
        return <Zap className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: Event["type"]) => {
    const typeConfig = eventTypes.find((t) => t.value === type)
    if (!typeConfig) return <Calendar className="h-4 w-4" />
    const Icon = typeConfig.icon
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Eventos y Networking</h1>
              <p className="text-muted-foreground mt-2">Conecta, aprende y haz crecer tu red profesional</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Evento
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Presencial</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    <SelectItem value="free">Gratis</SelectItem>
                    <SelectItem value="paid">De pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Próximos ({mockEvents.length})</TabsTrigger>
            <TabsTrigger value="attending">Asistiendo (2)</TabsTrigger>
            <TabsTrigger value="bookmarked">Guardados (3)</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                {event.featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-nova-accent text-white">Destacado</Badge>
                )}
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Event Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(event.type)}
                        <Badge variant="secondary" className="text-xs">
                          {eventTypes.find((t) => t.value === event.type)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-nova-accent transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(event.date)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getLocationIcon(event.location.type)}
                      <span>
                        {event.location.type === "online"
                          ? "Evento virtual"
                          : event.location.venue
                            ? `${event.location.venue}, ${event.location.city}`
                            : event.location.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendees.confirmed} confirmados
                        {event.attendees.max && ` / ${event.attendees.max} máximo`}
                      </span>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 py-3 border-t border-b">
                    <div className="w-8 h-8 bg-nova-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-nova-accent">{event.organizer.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{event.organizer.name}</span>
                        {event.organizer.isVerified && <Badge className="text-xs bg-green-100 text-green-800">✓</Badge>}
                      </div>
                      {event.organizer.company && (
                        <p className="text-xs text-muted-foreground">{event.organizer.company}</p>
                      )}
                    </div>
                    {event.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{event.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-lg font-bold text-nova-accent">{formatPrice(event.price)}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmarkEvent(event.id)}
                        className={event.isBookmarked ? "text-nova-accent" : ""}
                      >
                        <Bookmark className={`h-4 w-4 ${event.isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleAttendEvent(event.id)}
                        className={event.isAttending ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {event.isAttending ? "Asistiendo" : "Asistir"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No se encontraron eventos</h3>
              <p className="text-muted-foreground mb-6">Intenta cambiar los filtros o términos de búsqueda</p>
              <Button variant="outline">Limpiar filtros</Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Cargar más eventos
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

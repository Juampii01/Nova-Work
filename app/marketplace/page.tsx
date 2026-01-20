"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Search,
  Star,
  MapPin,
  Clock,
  User,
  Briefcase,
  Heart,
  Share2,
  ChevronRight,
  Verified,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  price: {
    type: "fixed" | "hourly" | "project"
    amount: number
    currency: string
  }
  deliveryTime: string
  provider: {
    name: string
    avatar?: string
    rating: number
    reviewCount: number
    isVerified: boolean
    level: "Nuevo" | "Nivel 1" | "Nivel 2" | "Top Rated"
    location: string
    distance: number
  }
  images: string[]
  tags: string[]
  featured: boolean
  orders: number
  responseTime: string
}

const mockServices: Service[] = [
  {
    id: "1",
    title: "Diseño de Logo Profesional + Identidad de Marca",
    description:
      "Creo logos únicos y memorables para tu empresa. Incluye 3 conceptos iniciales, revisiones ilimitadas y archivos en todos los formatos.",
    category: "Diseño Gráfico",
    subcategory: "Logos e Identidad",
    price: { type: "fixed", amount: 15000, currency: "ARS" },
    deliveryTime: "3 días",
    provider: {
      name: "María Fernández",
      rating: 4.9,
      reviewCount: 127,
      isVerified: true,
      level: "Top Rated",
      location: "Palermo, CABA",
      distance: 2.3,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Logo+Design"],
    tags: ["Logo", "Branding", "Identidad Visual"],
    featured: true,
    orders: 89,
    responseTime: "1 hora",
  },
  {
    id: "2",
    title: "Desarrollo Web Completo - Landing Page Profesional",
    description:
      "Desarrollo landing pages modernas y responsivas con React y Next.js. Optimizadas para conversión y SEO.",
    category: "Programación",
    subcategory: "Desarrollo Web",
    price: { type: "project", amount: 45000, currency: "ARS" },
    deliveryTime: "7 días",
    provider: {
      name: "Carlos Rodríguez",
      rating: 4.8,
      reviewCount: 93,
      isVerified: true,
      level: "Nivel 2",
      location: "Villa Crespo, CABA",
      distance: 4.1,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Web+Development"],
    tags: ["React", "Next.js", "Responsive"],
    featured: false,
    orders: 56,
    responseTime: "2 horas",
  },
  {
    id: "3",
    title: "Fotografía de Productos para E-commerce",
    description: "Sesión fotográfica profesional para productos. Incluye hasta 20 productos, edición y fondos neutros.",
    category: "Fotografía",
    subcategory: "Productos",
    price: { type: "fixed", amount: 25000, currency: "ARS" },
    deliveryTime: "2 días",
    provider: {
      name: "Ana López",
      rating: 4.7,
      reviewCount: 78,
      isVerified: true,
      level: "Nivel 1",
      location: "Belgrano, CABA",
      distance: 6.8,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Product+Photography"],
    tags: ["E-commerce", "Productos", "Estudio"],
    featured: true,
    orders: 34,
    responseTime: "30 min",
  },
  {
    id: "4",
    title: "Consultoría en Marketing Digital y Redes Sociales",
    description: "Estrategia completa de marketing digital. Análisis, plan de contenidos y optimización de campañas.",
    category: "Marketing",
    subcategory: "Marketing Digital",
    price: { type: "hourly", amount: 3500, currency: "ARS" },
    deliveryTime: "Flexible",
    provider: {
      name: "Roberto Silva",
      rating: 4.9,
      reviewCount: 156,
      isVerified: true,
      level: "Top Rated",
      location: "Recoleta, CABA",
      distance: 1.9,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Digital+Marketing"],
    tags: ["SEO", "SEM", "Redes Sociales"],
    featured: false,
    orders: 112,
    responseTime: "15 min",
  },
  {
    id: "5",
    title: "Traducción Profesional Español-Inglés",
    description: "Traducciones precisas y naturales. Especializada en textos técnicos, marketing y documentos legales.",
    category: "Redacción",
    subcategory: "Traducción",
    price: { type: "fixed", amount: 800, currency: "ARS" },
    deliveryTime: "1 día",
    provider: {
      name: "Laura Martínez",
      rating: 4.8,
      reviewCount: 203,
      isVerified: true,
      level: "Top Rated",
      location: "San Telmo, CABA",
      distance: 3.7,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Translation"],
    tags: ["Inglés", "Técnico", "Legal"],
    featured: false,
    orders: 287,
    responseTime: "45 min",
  },
  {
    id: "6",
    title: "Edición de Video Profesional para YouTube",
    description: "Edición completa de videos para YouTube. Incluye cortes, transiciones, música y thumbnails.",
    category: "Video",
    subcategory: "Edición",
    price: { type: "fixed", amount: 8000, currency: "ARS" },
    deliveryTime: "2 días",
    provider: {
      name: "Diego Fernández",
      rating: 4.6,
      reviewCount: 67,
      isVerified: false,
      level: "Nivel 1",
      location: "Caballito, CABA",
      distance: 8.2,
    },
    images: ["/placeholder.svg?height=200&width=300&text=Video+Editing"],
    tags: ["YouTube", "Premiere", "After Effects"],
    featured: false,
    orders: 23,
    responseTime: "3 horas",
  },
]

const categories = [
  "Todos",
  "Diseño Gráfico",
  "Programación",
  "Marketing",
  "Redacción",
  "Fotografía",
  "Video",
  "Música",
  "Consultoría",
]

const priceRanges = ["Todos los precios", "Hasta $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "Más de $50,000"]

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPriceRange, setSelectedPriceRange] = useState("Todos los precios")
  const [sortBy, setSortBy] = useState<"relevance" | "price_low" | "price_high" | "rating" | "orders">("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredServices = services
    .filter((service) => {
      if (
        searchQuery &&
        !service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }
      if (selectedCategory !== "Todos" && service.category !== selectedCategory) {
        return false
      }
      if (selectedPriceRange !== "Todos los precios") {
        const price = service.price.amount
        switch (selectedPriceRange) {
          case "Hasta $10,000":
            return price <= 10000
          case "$10,000 - $25,000":
            return price > 10000 && price <= 25000
          case "$25,000 - $50,000":
            return price > 25000 && price <= 50000
          case "Más de $50,000":
            return price > 50000
          default:
            return true
        }
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price.amount - b.price.amount
        case "price_high":
          return b.price.amount - a.price.amount
        case "rating":
          return b.provider.rating - a.provider.rating
        case "orders":
          return b.orders - a.orders
        case "relevance":
        default:
          return b.featured ? 1 : -1
      }
    })

  const formatPrice = (price: Service["price"]) => {
    const formatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    })

    switch (price.type) {
      case "hourly":
        return `${formatter.format(price.amount)}/hora`
      case "project":
        return `Desde ${formatter.format(price.amount)}`
      case "fixed":
      default:
        return formatter.format(price.amount)
    }
  }

  const getLevelBadgeColor = (level: Service["provider"]["level"]) => {
    switch (level) {
      case "Top Rated":
        return "bg-yellow-500 text-white"
      case "Nivel 2":
        return "bg-blue-500 text-white"
      case "Nivel 1":
        return "bg-green-500 text-white"
      case "Nuevo":
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Marketplace de Servicios</h1>
              <p className="text-muted-foreground mt-2">Encuentra profesionales locales para tus proyectos</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/marketplace/sell">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Vender Servicios
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
                  placeholder="Buscar servicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
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

                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Más relevantes</SelectItem>
                    <SelectItem value="price_low">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price_high">Precio: mayor a menor</SelectItem>
                    <SelectItem value="rating">Mejor valorados</SelectItem>
                    <SelectItem value="orders">Más vendidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{filteredServices.length} servicios encontrados</p>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              Grid
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              Lista
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/marketplace/service/${service.id}`}>
                <div className="relative">
                  {service.featured && (
                    <Badge className="absolute top-3 left-3 z-10 bg-nova-accent text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Service Info */}
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-nova-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{service.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {service.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Provider Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-nova-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-nova-accent">
                          {service.provider.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium truncate">{service.provider.name}</span>
                          {service.provider.isVerified && <Verified className="h-3 w-3 text-nova-accent" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{service.provider.rating}</span>
                            <span>({service.provider.reviewCount})</span>
                          </div>
                          <span>•</span>
                          <Badge className={`text-xs ${getLevelBadgeColor(service.provider.level)}`}>
                            {service.provider.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Location and Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{service.provider.distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{service.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{service.orders}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold text-nova-accent">{formatPrice(service.price)}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          Ver Detalles
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No se encontraron servicios</h3>
              <p className="text-muted-foreground mb-6">Intenta cambiar los filtros o términos de búsqueda</p>
              <Button variant="outline">Limpiar filtros</Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredServices.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Cargar más servicios
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

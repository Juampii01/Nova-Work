"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Search,
  MapPin,
  Heart,
  MessageCircle,
  Verified,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  Map,
  List,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getJobs, getProfiles, type Job as DBJob, type Profile } from "@/lib/supabase/database"

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRadius, setSelectedRadius] = useState("5")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedModality, setSelectedModality] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [activeTab, setActiveTab] = useState("jobs")
  const [showLast24h, setShowLast24h] = useState(false)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [jobs, setJobs] = useState<
    (DBJob & {
      companies?: {
        id: string
        name: string
        logo_url?: string
        slug: string
        is_verified?: boolean
      }
    })[]
  >([])
  const [candidates, setCandidates] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
        },
        () => {
          setLocationPermission("denied")
        },
      )
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [jobsData, profilesData] = await Promise.all([
          getJobs({
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            modality: selectedModality !== "all" ? selectedModality : undefined,
            job_type: selectedType !== "all" ? selectedType : undefined,
          }),
          getProfiles(),
        ])
        setJobs(jobsData)
        setCandidates(profilesData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedCategory, selectedModality, selectedType])

  const filteredJobs = jobs
    .filter((job) => {
      if (showLast24h) {
        const jobDate = new Date(job.created_at).getTime()
        const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000
        if (jobDate < oneDayAgo) return false
      }
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(job.location_text?.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "relevant":
          return b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : -1
        case "distance":
        default:
          return 0
      }
    })

  const filteredCandidates = candidates.filter((candidate) => {
    if (
      searchQuery &&
      !candidate.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !candidate.profession?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
        },
        () => {
          setLocationPermission("denied")
        },
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationPermission !== "granted" && (
          <Card className="mb-6 border-accent/20 bg-accent/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Activá tu ubicación</p>
                  <p className="text-sm text-muted-foreground">
                    Para mostrarte empleos cerca tuyo, necesitamos acceso a tu ubicación
                  </p>
                </div>
              </div>
              <Button onClick={requestLocation} size="sm">
                Activar ubicación
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Featured Section */}
        {jobs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-2xl">✨ Destacadas</h2>
              <p className="text-sm text-muted-foreground">Ofertas de empresas verificadas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobs
                .filter((job) => job.companies?.is_verified === true)
                .slice(0, 3)
                .map((job) => (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group border-accent/20 hover:border-accent/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-accent transition-colors leading-snug">
                                {job.title}
                              </h3>
                              {job.companies?.is_verified && (
                                <Verified className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{job.companies?.name}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {job.modality && <Badge variant="outline" className="text-xs">{job.modality}</Badge>}
                          {(job.salary_min || job.salary_max) && (
                            <Badge className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                              {job.salary_min && `$${job.salary_min}`}
                              {job.salary_min && job.salary_max && " - "}
                              {job.salary_max && `$${job.salary_max}`}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empleos, empresas o ubicaciones..."
              className="pl-10 pr-4 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={selectedRadius} onValueChange={setSelectedRadius}>
              <SelectTrigger className="w-[140px]">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="3">3 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <Briefcase className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="tech">Tecnología</SelectItem>
                <SelectItem value="oficios">Oficios</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
                <SelectItem value="gastronomia">Gastronomía</SelectItem>
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="logistica">Logística</SelectItem>
                <SelectItem value="educacion">Educación</SelectItem>
                <SelectItem value="admin">Administración</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedModality} onValueChange={setSelectedModality}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="híbrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="tiempo_completo">Tiempo completo</SelectItem>
                <SelectItem value="medio_tiempo">Medio tiempo</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="por_proyecto">Por proyecto</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Más cercano</SelectItem>
                <SelectItem value="recent">Más reciente</SelectItem>
                <SelectItem value="relevant">Más relevante</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showLast24h ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLast24h(!showLast24h)}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Últimas 24h</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="jobs" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Ofertas ({jobs.length})</span>
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Candidatos ({candidates.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="jobs">
            {viewMode === "list" ? (
              <div className="space-y-4">
                {isLoading ? (
                  <Card className="p-12 text-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  </Card>
                ) : filteredJobs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">No hay empleos disponibles</h3>
                    <p className="text-muted-foreground mb-4">Probá cambiar los filtros o ser el primero en publicar</p>
                    <Link href="/post">
                      <Button>Publicar empleo</Button>
                    </Link>
                  </Card>
                ) : (
                  filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
                )}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Map className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Vista de mapa</h3>
                    <p className="text-muted-foreground">Próximamente disponible</p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="candidates">
            <div className="space-y-4">
              {isLoading ? (
                <Card className="p-12 text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                  </div>
                </Card>
              ) : filteredCandidates.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">No hay candidatos disponibles</h3>
                  <p className="text-muted-foreground">Probá cambiar los términos de búsqueda</p>
                </Card>
              ) : (
                filteredCandidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

function JobCard({
  job,
}: {
  job: DBJob & {
    companies?: {
      id: string
      name: string
      logo_url?: string
      slug: string
      is_verified?: boolean
    }
  }
}) {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/job/${job.id}`} className="hover:text-accent transition-colors">
                  <h3 className="font-heading font-semibold text-lg">{job.title}</h3>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  {job.companies ? (
                    <>
                      <Link
                        href={`/company/${job.companies.slug}`}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {job.companies.name}
                      </Link>
                      {job.companies.is_verified && (
                        <div className="flex items-center" aria-label="Empresa verificada">
                          <Verified className="w-4 h-4 text-blue-500" />
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Empresa no especificada</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className="text-muted-foreground hover:text-accent"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>

            {job.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">{job.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {job.category && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {job.category}
                </Badge>
              )}
              {job.modality && (
                <Badge variant="outline" className="text-xs">
                  {job.modality}
                </Badge>
              )}
              {job.job_type && (
                <Badge variant="outline" className="text-xs">
                  {job.job_type}
                </Badge>
              )}
              {(job.salary_min || job.salary_max) && (
                <Badge className="text-xs flex items-center space-x-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                  <DollarSign className="w-3 h-3" />
                  <span>
                    {job.salary_min
                      ? `${job.salary_currency ?? "$"}${job.salary_min}`
                      : ""}
                    {(job.salary_min && job.salary_max) ? " - " : ""}
                    {job.salary_max
                      ? `${job.salary_currency ?? "$"}${job.salary_max}`
                      : ""}
                  </span>
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center space-x-4">
                {job.location_text && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location_text}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/job/${job.id}`}>
                  <Button size="sm">Ver detalles</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CandidateCard({ candidate }: { candidate: Profile }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
            {candidate.avatar_url ? (
              <img
                src={candidate.avatar_url || "/placeholder.svg"}
                alt={candidate.full_name || ""}
                className="w-full h-full rounded-full"
              />
            ) : (
              <span className="font-semibold text-accent">{candidate.full_name?.charAt(0) || "?"}</span>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/u/${candidate.username}`} className="hover:text-accent transition-colors">
                  <h3 className="font-heading font-semibold text-lg">{candidate.full_name || "Usuario"}</h3>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-muted-foreground">{candidate.profession || "Profesional"}</span>
                  {candidate.is_verified && <Verified className="w-4 h-4 text-accent" />}
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Disponible
                  </Badge>
                </div>
              </div>
            </div>

            {candidate.bio && (
              <p className="text-muted-foreground text-sm line-clamp-2">{candidate.bio}</p>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center space-x-4">
                {candidate.location_text && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{candidate.location_text}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <span>⭐ {candidate.average_rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/u/${candidate.username}`}>
                  <Button size="sm">Ver perfil</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

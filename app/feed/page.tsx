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
import { getJobs, getJobsNear, getProfiles, getProfilesNear, type Job as DBJob, type Profile } from "@/lib/supabase/database"
import { MapView, MapMarker } from "@/components/map-view"

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
        let jobsData = []
        if (userLocation && selectedRadius !== "all") {
          jobsData = await getJobsNear({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radiusKm: Number(selectedRadius),
            filters: {
              category: selectedCategory !== "all" ? selectedCategory : undefined,
              modality: selectedModality !== "all" ? selectedModality : undefined,
              job_type: selectedType !== "all" ? selectedType : undefined,
            },
          })
        } else {
          jobsData = await getJobs({
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            modality: selectedModality !== "all" ? selectedModality : undefined,
            job_type: selectedType !== "all" ? selectedType : undefined,
          })
        }
        let profilesData = []
        if (userLocation && selectedRadius !== "all") {
          profilesData = await getProfilesNear({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radiusKm: Number(selectedRadius),
          })
        } else {
          profilesData = await getProfiles()
        }
        setJobs(jobsData)
        setCandidates(profilesData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [userLocation, selectedRadius, selectedCategory, selectedModality, selectedType])

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
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/10 animate-fade-in">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationPermission !== "granted" && (
          <Card className="mb-6 border-accent/20 bg-gradient-to-r from-accent/10 to-background/80 backdrop-blur-xl shadow-lg animate-fade-in-up">
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
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-extrabold text-2xl bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">✨ Destacadas</h2>
              <p className="text-sm text-muted-foreground">Ofertas de empresas verificadas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs
                .filter((job) => job.companies?.is_verified === true)
                .slice(0, 3)
                .map((job) => (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <Card className="h-full hover:shadow-2xl transition-shadow cursor-pointer group border-accent/20 hover:border-accent/50 bg-gradient-to-br from-white/80 to-accent/10 dark:from-[#1a2f26]/80 dark:to-accent/10 backdrop-blur-xl animate-fade-in-up">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-accent transition-colors leading-snug">
                                {job.title}
                              </h3>
                              {job.companies?.is_verified && (
                                <Verified className="w-4 h-4 text-blue-600 flex-shrink-0 animate-bounce" />
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
        <div className="space-y-4 mb-8 animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-accent animate-pulse" />
            <Input
              placeholder="Buscar empleos, empresas o ubicaciones..."
              className="pl-10 pr-4 h-12 text-base rounded-xl bg-white/80 dark:bg-[#1a2f26]/80 shadow-md focus:ring-accent/40 animate-fade-in"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 animate-fade-in-up">
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

        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-xl rounded-xl shadow-md">
              <TabsTrigger value="jobs" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:shadow-lg transition-all">
                <Briefcase className="w-4 h-4" />
                <span>Ofertas ({jobs.length})</span>
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:shadow-lg transition-all">
                <Users className="w-4 h-4" />
                <span>Candidatos ({candidates.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2 animate-fade-in-up">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="rounded-xl shadow-md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              className="rounded-xl shadow-md"
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
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
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
                  <Select value={selectedRadius} onValueChange={setSelectedRadius}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Radio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 km</SelectItem>
                      <SelectItem value="3">3 km</SelectItem>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="all">Sin filtro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <MapView
                  markers={filteredJobs
                    .filter((job) => job.lat && job.lng)
                    .map((job) => ({
                      id: job.id,
                      type: "job",
                      lat: job.lat,
                      lng: job.lng,
                      title: job.title,
                      subtitle: job.location_text || "",
                    }))}
                  center={userLocation || { lat: -34.6037, lng: -58.3816 }}
                  zoom={13}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="candidates">
            {viewMode === "list" ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
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
                  <Select value={selectedRadius} onValueChange={setSelectedRadius}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Radio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 km</SelectItem>
                      <SelectItem value="3">3 km</SelectItem>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="all">Sin filtro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <MapView
                  markers={filteredCandidates
                    .filter((c) => c.lat && c.lng)
                    .map((c) => ({
                      id: c.id,
                      type: "candidate",
                      lat: c.lat,
                      lng: c.lng,
                      title: c.full_name || "Candidato",
                      subtitle: c.profession || "",
                    }))}
                  center={userLocation || { lat: -34.6037, lng: -58.3816 }}
                  zoom={13}
                />
              </div>
            )}
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
    <Card className="hover:shadow-2xl transition-shadow bg-gradient-to-br from-white/80 to-accent/10 dark:from-[#1a2f26]/80 dark:to-accent/10 backdrop-blur-xl animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/job/${job.id}`} className="hover:text-accent transition-colors">
                  <h3 className="font-heading font-semibold text-lg animate-fade-in-up">{job.title}</h3>
                </Link>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Publicado por: {job.owner_profile?.full_name || job.owner_profile?.username || 'Usuario'}
                  </span>
                  {job.companies?.name && (
                    <span className="text-xs text-muted-foreground">Organización: {job.companies.name}</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className="text-muted-foreground hover:text-accent transition-all animate-fade-in"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-accent text-accent animate-bounce" : ""}`} />
              </Button>
            </div>

            {job.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 animate-fade-in-up">{job.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {job.category && (
                <Badge variant="secondary" className="text-xs font-medium animate-fade-in-up">
                  {job.category}
                </Badge>
              )}
              {job.modality && (
                <Badge variant="outline" className="text-xs animate-fade-in-up">
                  {job.modality}
                </Badge>
              )}
              {job.job_type && (
                <Badge variant="outline" className="text-xs animate-fade-in-up">
                  {job.job_type}
                </Badge>
              )}
              {(job.salary_min || job.salary_max) && (
                <Badge className="text-xs flex items-center space-x-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 animate-fade-in-up">
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
                    <span>
                      {job.city && job.region && job.country
                        ? `${job.city}, ${job.region}, ${job.country}`
                        : job.location_text}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground rounded-xl animate-fade-in">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/job/${job.id}`}>
                  <Button size="sm" className="rounded-xl animate-fade-in">Ver detalles</Button>
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
    <Card className="hover:shadow-2xl transition-shadow bg-gradient-to-br from-white/80 to-accent/10 dark:from-[#1a2f26]/80 dark:to-accent/10 backdrop-blur-xl animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 animate-fade-in">
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
                  <h3 className="font-heading font-semibold text-lg animate-fade-in-up">{candidate.full_name || "Usuario"}</h3>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-muted-foreground">{candidate.profession || "Profesional"}</span>
                  {candidate.is_verified && <Verified className="w-4 h-4 text-accent animate-bounce" />}
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 animate-fade-in-up">
                    Disponible
                  </Badge>
                </div>
              </div>
            </div>

            {candidate.bio && (
              <p className="text-muted-foreground text-sm line-clamp-2 animate-fade-in-up">{candidate.bio}</p>
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
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground rounded-xl animate-fade-in">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/u/${candidate.username}`}>
                  <Button size="sm" className="rounded-xl animate-fade-in">Ver perfil</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

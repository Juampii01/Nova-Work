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
  // const [isClient, setIsClient] = useState(false)
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
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

  // if (!isClient) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <span className="text-muted-foreground text-lg animate-pulse">Cargando...</span>
  //     </div>
  //   )
  // }

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
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Explorar empleos y perfiles</h1>
        {/* Aquí puedes agregar filtros, tabs, búsqueda, etc. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Empleos</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando empleos...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-muted-foreground">No se encontraron empleos.</p>
            ) : (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Candidatos</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando perfiles...</p>
            ) : candidates.length === 0 ? (
              <p className="text-muted-foreground">No se encontraron candidatos.</p>
            ) : (
              candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
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

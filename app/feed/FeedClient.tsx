"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getJobs, getJobsNear, getProfiles, getProfilesNear, getSavedJobs, saveJob, type Job as DBJob, type Profile } from "@/lib/supabase/database"
import { useToast } from "@/hooks/use-toast"
import { JobCard, CandidateCard } from "./feed-cards"
import { useAuth } from "@/hooks/use-auth"
import { CandidateProfileModal } from "@/components/candidate-profile-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapView, MapMarker } from "@/components/map-view"
import { Search, MapPin, Heart, MessageCircle, Verified, Clock, DollarSign, Briefcase, Users, Map, List, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function FeedClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  // Cargar favoritos al inicio y cuando cambia el usuario
  useEffect(() => {
    if (!user?.id) return;
    getSavedJobs().then((saved) => {
      setSavedJobIds(saved.map((j: any) => j.id));
    });
  }, [user?.id]);
  // Handler global para guardar/quitar favoritos y refrescar el estado SIEMPRE desde la base
  const handleToggleFavorite = async (jobId: string) => {
    // Buscar el job actual para validar si es del usuario
    const job = jobs.find((j) => j.id === jobId);
    if (job?.posted_by === user?.id) {
      toast({
        title: "No puedes guardar tu propio aviso",
        description: "No tiene sentido guardar un empleo que tú publicaste.",
        variant: "destructive",
      });
      return;
    }
    try {
      await saveJob(jobId); // Solo ejecuta el toggle
      // SIEMPRE refresca desde la base de datos
      const saved = await getSavedJobs();
      setSavedJobIds(saved.map((j: any) => j.id));
      // Feedback según estado real
      const isNowSaved = saved.some((j: any) => j.id === jobId);
      toast({
        title: isNowSaved ? "Guardado en favoritos" : "Eliminado de favoritos",
        description: isNowSaved
          ? "El empleo fue guardado en tu lista de favoritos."
          : "El empleo fue quitado de tus favoritos.",
      });
    } catch (err) {
      toast({
        title: "Error inesperado",
        description: "No se pudo actualizar el favorito. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };
    const [selectedCandidate, setSelectedCandidate] = useState<null | any>(null)
    const [modalOpen, setModalOpen] = useState(false)
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

  // Separar empleos propios y ajenos
  const ownJobs = filteredJobs.filter(job => job.posted_by === user?.id)
  const otherJobs = filteredJobs.filter(job => job.posted_by !== user?.id)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-accent">Explorar empleos y perfiles</h1>
            <p className="text-muted-foreground mt-4">Encontrá oportunidades cerca tuyo y perfiles destacados</p>
          </div>
          <div className="mb-10 flex flex-col md:flex-row md:items-end gap-4 justify-center">
            <Input
              type="text"
              placeholder="Buscar empleo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="max-w-md bg-white border border-neutral-200 rounded-lg px-4 py-2 text-neutral-800 placeholder:text-neutral-400 shadow-sm focus-visible:ring-accent/30 focus-visible:border-accent/40"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="min-w-[120px] bg-white border border-neutral-200 text-white rounded-lg shadow-sm">
                <SelectValue placeholder="Seleccionar categoría" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="bg-white text-neutral-800">Todas</SelectItem>
                <SelectItem value="tecnologia">Tecnología</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
                <SelectItem value="diseño">Diseño</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedModality} onValueChange={setSelectedModality}>
              <SelectTrigger className="min-w-[120px] bg-white border border-neutral-200 text-white rounded-lg shadow-sm">
                <SelectValue placeholder="Seleccionar modalidad" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="bg-white text-neutral-800">Todas</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="min-w-[120px] bg-white border border-neutral-200 text-white rounded-lg shadow-sm">
                <SelectValue placeholder="Seleccionar tipo" className="text-white" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="bg-white text-neutral-800">Todos</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="temporal">Temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Tabs para alternar entre empleos y usuarios */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="flex gap-4 justify-center border-b border-muted/40 mb-8">
              <TabsTrigger
                value="jobs"
                className={`flex items-center gap-2 px-8 py-3 rounded-t-xl font-bold text-lg transition-all duration-200 border-b-4
                  ${activeTab === "jobs"
                    ? "bg-white border-accent text-accent shadow-sm"
                    : "bg-transparent border-transparent text-muted-foreground font-normal"}
                `}
              >
                <Briefcase className="w-5 h-5" /> Empleos
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className={`flex items-center gap-2 px-8 py-3 rounded-t-xl font-bold text-lg transition-all duration-200 border-b-4
                  ${activeTab === "users"
                    ? "bg-white border-accent text-accent shadow-sm"
                    : "bg-transparent border-transparent text-muted-foreground font-normal"}
                `}
              >
                <Users className="w-5 h-5" /> Usuarios
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              {/* Apartado de empleos */}
              <div className="mb-20">
                {ownJobs.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Tus empleos publicados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {ownJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={savedJobIds.includes(job.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {isLoading ? (
                    <p className="text-muted-foreground col-span-full">Cargando empleos...</p>
                  ) : otherJobs.length === 0 ? (
                    <p className="text-muted-foreground col-span-full">No se encontraron empleos.</p>
                  ) : (
                    otherJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobIds.includes(job.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="users">
              {/* Apartado de usuarios/perfiles */}
              <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {isLoading ? (
                    <p className="text-muted-foreground col-span-full">Cargando perfiles...</p>
                  ) : candidates.length === 0 ? (
                    <p className="text-muted-foreground col-span-full">No se encontraron candidatos.</p>
                  ) : (
                    candidates.map((candidate) => (
                      <div key={candidate.id}>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedCandidate(candidate)
                            setModalOpen(true)
                          }}
                        >
                          <CandidateCard candidate={candidate} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <CandidateProfileModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        profile={selectedCandidate}
        isLoading={false}
      />
      <Footer />
    </div>
  )
}

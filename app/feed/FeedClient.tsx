"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getJobs, getJobsNear, getProfiles, getProfilesNear, getSavedJobs, saveJob, type Job as DBJob, type Profile } from "@/lib/supabase/database"
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
      const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
      // Cargar favoritos al inicio y cuando cambia el usuario
      useEffect(() => {
        if (!user?.id) return;
        getSavedJobs().then((saved) => {
          setSavedJobIds(saved.map((j: any) => j.id));
        });
      }, [user?.id]);
      // Handler global para guardar/quitar favoritos y refrescar el estado
      const handleToggleFavorite = async (jobId: string) => {
        await saveJob(jobId);
        const saved = await getSavedJobs();
        setSavedJobIds(saved.map((j: any) => j.id));
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
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Candidatos</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando perfiles...</p>
            ) : candidates.length === 0 ? (
              <p className="text-muted-foreground">No se encontraron candidatos.</p>
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
          </section>
        </div>
      </main>
      {/* Modal de perfil de candidato */}
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

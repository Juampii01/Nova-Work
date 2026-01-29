
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { JobCard } from "@/app/feed/feed-cards"
import { getSavedJobs, saveJob } from "@/lib/supabase/database"
import { useToast } from "@/hooks/use-toast"

import type { Profile, Job } from "@/lib/supabase/database"
import { useAuth } from "@/hooks/use-auth"

export function CandidateDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const { toast } = useToast()
  const [savedJobs, setSavedJobs] = useState<(Job & { companies?: { id: string; name: string; logo_url?: string; slug: string; is_verified?: boolean } })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])

  // Cargar perfil y favoritos al inicio y cuando cambia el usuario
  useEffect(() => {
    if (!user?.id) return
    setIsLoading(true)
    // Traer perfil (si existe endpoint o función)
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false))
    getSavedJobs().then((saved) => {
      setSavedJobs(saved)
      setSavedJobIds(saved.map((j: any) => j.id))
      setIsLoading(false)
    })
  }, [user?.id])

  // Handler para guardar/quitar favoritos y refrescar el estado
  const handleToggleFavorite = async (jobId: string) => {
    const job = savedJobs.find((j) => j.id === jobId)
    if (job?.posted_by === user?.id) {
      toast({
        title: "No puedes guardar tu propio aviso",
        description: "No tiene sentido guardar un empleo que tú publicaste.",
        variant: "destructive",
      })
      return
    }
    try {
      const result = await saveJob(jobId)
      if (result) {
        const updated = await getSavedJobs()
        setSavedJobs(updated)
        setSavedJobIds(updated.map((j: any) => j.id))
        toast({
          title: savedJobIds.includes(jobId)
            ? "Eliminado de favoritos"
            : "Guardado en favoritos",
          description: savedJobIds.includes(jobId)
            ? "El empleo fue quitado de tus favoritos."
            : "El empleo fue guardado en tu lista de favoritos.",
        })
      } else {
        toast({
          title: "Error al guardar favorito",
          description: "Intenta de nuevo. Si el problema persiste, contacta soporte.",
          variant: "destructive",
        })
        // Log extra error info if available
        console.error("[Favoritos] Error al guardar/quitar favorito: posible problema de sesión, RLS o Supabase.")
      }
    } catch (error: any) {
      toast({
        title: "Error inesperado",
        description: error?.message || "No se pudo guardar el favorito. Intenta más tarde.",
        variant: "destructive",
      })
      console.error("[Favoritos] Error inesperado:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-primary/10">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-2 animate-fade-in-up">Dashboard de Candidato</h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in">Tus postulaciones y chats con empleadores</p>
        {/* Mis postulaciones reales */}
        {profile?.id && require("@/components/candidate-applications.tsx").CandidateApplications({ userId: profile.id })}

        {/* Mis Favoritos */}
        <Card className="mt-8 border-0 shadow-xl animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-xl">Mis Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Cargando empleos guardados...</p>
            ) : savedJobs.length === 0 ? (
              <p className="text-muted-foreground">No tienes empleos guardados.</p>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job as Job & { companies?: { id: string; name: string; logo_url?: string; slug: string; is_verified?: boolean } }}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accesos rápidos a chats */}
        <Card className="mt-8 backdrop-blur-xl bg-white/80 dark:bg-[#1a2f26]/80 border-0 shadow-xl animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-xl">Chats con empleadores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">(Próximamente: accesos rápidos a conversaciones)</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

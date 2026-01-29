"use client"

import { useEffect, useState } from "react"
import { JobCard } from "../feed/feed-cards"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { getSavedJobs, saveJob } from "@/lib/supabase/database"

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setError("No has iniciado sesión. Inicia sesión para ver tus favoritos.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    getSavedJobs()
      .then((data) => {
        setJobs(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError("Error al cargar favoritos: " + (err?.message || err))
        setIsLoading(false)
      })
  }, [user?.id])

  const handleToggleFavorite = async (jobId: string) => {
    try {
      await saveJob(jobId)
      const updated = await getSavedJobs()
      setJobs(updated)
    } catch (err) {
      setError("Error al actualizar favoritos: " + (typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err)))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Cargando empleos guardados...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : !user?.id ? (
          <p className="text-muted-foreground">Debes iniciar sesión para ver tus favoritos.</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted-foreground">No tienes empleos guardados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isSaved={true} onToggleFavorite={handleToggleFavorite} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

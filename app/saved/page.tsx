"use client"

import { useEffect, useState } from "react"
import { JobCard } from "../feed/feed-cards"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { getSavedJobs } from "@/lib/supabase/database"

export default function SavedJobsPage() {
  const { user, isAuthenticated } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setIsLoading(true)
    getSavedJobs().then((data) => {
      setJobs(data)
      setIsLoading(false)
    })
  }, [user?.id])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Cargando empleos guardados...</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted-foreground">No tienes empleos guardados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

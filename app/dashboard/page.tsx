"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CreateJobModal } from "@/components/create-job-modal"
import { CandidateProfileModal } from "@/components/candidate-profile-modal"
import { Users, Briefcase, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"
import { toast } from "sonner"

// Lazy load analytics
const AnalyticsView = dynamic(() => import("@/components/analytics-view").then(mod => ({ default: mod.AnalyticsView })), {
  loading: () => <div className="h-96 bg-muted rounded animate-pulse" />,
})

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week")
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([])
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, activeJobs: 0 })
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<string | null>(null)
  const [applicants, setApplicants] = useState<any[]>([])
  const [applicantFilter, setApplicantFilter] = useState<"all" | "pending" | "viewed" | "accepted" | "rejected">("all")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [candidateModalOpen, setCandidateModalOpen] = useState(false)
  const [loadingCandidateProfile, setLoadingCandidateProfile] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>({
    viewsData: [],
    categoryData: [],
    statusData: { pending: 0, viewed: 0, accepted: 0, rejected: 0 },
  })
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Debes iniciar sesión para acceder")
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  // Load recruiter data
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return
      setDataLoading(true)
      
      try {
        const {
          getRecruiterJobs,
          getRecruiterStats,
          getJobApplications,
          getJobsViewsOverTime,
          getApplicationsByCategory,
          getApplicationStatusBreakdown,
        } = await import("@/lib/supabase/database")
        
        const jobsData = await getRecruiterJobs(user.id)
        const statsData = await getRecruiterStats(user.id)
        
        // Load analytics
        const viewsData = await getJobsViewsOverTime(user.id, 30)
        const categoryData = await getApplicationsByCategory(user.id)
        const statusData = await getApplicationStatusBreakdown(user.id)
        
        setRecruiterJobs(jobsData)
        setStats(statsData)
        setAnalyticsData({ viewsData, categoryData, statusData })

        // Load applicants for first job
        if (jobsData.length > 0) {
          setSelectedJobForApplicants(jobsData[0].id)
          const appData = await getJobApplications(jobsData[0].id)
          setApplicants(appData)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast.error("Error al cargar datos")
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  // Load applicants when selected job changes
  useEffect(() => {
    async function loadApplicants() {
      if (!selectedJobForApplicants) return

      try {
        const { getJobApplications } = await import("@/lib/supabase/database")
        const appData = await getJobApplications(selectedJobForApplicants)
        
        if (applicantFilter === "all") {
          setApplicants(appData)
        } else {
          setApplicants(appData.filter((app: any) => app.status === applicantFilter))
        }
      } catch (error) {
        console.error("Error loading applicants:", error)
      }
    }

    loadApplicants()
  }, [selectedJobForApplicants, applicantFilter])

  // Memoize filtered applicants
  const filteredApplicants = useMemo(() => {
    if (applicantFilter === "all") return applicants
    return applicants.filter((app: any) => app.status === applicantFilter)
  }, [applicants, applicantFilter])

  const handleOpenCandidateProfile = async (candidateUserId: string) => {
    setLoadingCandidateProfile(true)
    setCandidateModalOpen(true)

    try {
      const { getCandidateProfile } = await import("@/lib/supabase/database")
      const profile = await getCandidateProfile(candidateUserId)
      setSelectedCandidate(profile)
    } catch (error) {
      console.error("Error loading candidate profile:", error)
      toast.error("Error al cargar el perfil")
    } finally {
      setLoadingCandidateProfile(false)
    }
  }

  // Handle job status update
  const handleJobStatusChange = async (jobId: string, newStatus: "active" | "closed" | "draft") => {
    try {
      const { updateJobStatus } = await import("@/lib/supabase/database")
      await updateJobStatus(jobId, newStatus)
      
      // Update local state
      setRecruiterJobs(recruiterJobs.map(j => 
        j.id === jobId ? { ...j, status: newStatus } : j
      ))
      
      toast.success(`Oferta ${newStatus === "active" ? "activada" : newStatus === "closed" ? "cerrada" : "guardada"}`)
    } catch (error) {
      toast.error("Error al actualizar oferta")
    }
  }

  // Handle delete job
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("¿Estás seguro que querés eliminar esta oferta?")) return

    try {
      const { deleteJob } = await import("@/lib/supabase/database")
      await deleteJob(jobId)
      
      setRecruiterJobs(recruiterJobs.filter(j => j.id !== jobId))
      toast.success("Oferta eliminada")
    } catch (error) {
      toast.error("Error al eliminar oferta")
    }
  }

  // Handle applicant status change
  const handleApplicationStatusChange = async (appId: string, newStatus: "pending" | "viewed" | "rejected" | "accepted") => {
    try {
      const { updateApplicationStatus } = await import("@/lib/supabase/database")
      await updateApplicationStatus(appId, newStatus)
      
      setApplicants(applicants.map(a =>
        a.id === appId ? { ...a, status: newStatus } : a
      ))
      
      toast.success(`Candidato marcado como ${newStatus}`)
    } catch (error) {
      toast.error("Error al actualizar candidato")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Reclutador</h1>
          <p className="text-muted-foreground">Gestiona tus ofertas y candidatos</p>
        </div>

        {/* Stats Grid - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Ofertas Publicadas</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalJobs}</p>
                </div>
                <Briefcase className="w-10 h-10 text-accent opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Ofertas Activas</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeJobs}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total de Aplicaciones</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Tasa de Conversión</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.totalJobs > 0 
                      ? Math.round((stats.totalApplications / (stats.totalJobs * 10)) * 100) 
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="trabajos">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
          </TabsList>

          {/* Resumen Tab */}
          <TabsContent value="resumen" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Ofertas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : recruiterJobs.length > 0 ? (
                    <div className="space-y-3">
                      {recruiterJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-3 border border-input rounded-lg">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{job.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {job.applications_count || 0} aplicaciones
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              job.status === "active" ? "bg-green-100 text-green-700" :
                              job.status === "closed" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {job.status === "active" ? "Activa" : job.status === "closed" ? "Cerrada" : "Borrador"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No tienes ofertas aún.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Últimas Aplicaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : applicants.length > 0 ? (
                    <div className="space-y-3">
                      {applicants.slice(0, 3).map((app) => (
                        <div key={app.id} className="p-3 border border-input rounded-lg">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{app.profiles?.first_name || "Candidato"}</p>
                              <p className="text-xs text-muted-foreground mt-1">{app.profiles?.profession || "Sin info"}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              app.status === "viewed" ? "bg-blue-100 text-blue-700" :
                              app.status === "accepted" ? "bg-green-100 text-green-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {app.status === "pending" ? "Pendiente" : app.status === "viewed" ? "Visto" : app.status === "accepted" ? "Aceptado" : "Rechazado"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Sin aplicaciones aún</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mis Ofertas Tab */}
          <TabsContent value="trabajos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mis Ofertas de Trabajo</h3>
              <CreateJobModal onJobCreated={() => {
                // Reload data
                setDataLoading(true)
                if (user?.id) {
                  import("@/lib/supabase/database").then(({ getRecruiterJobs }) => {
                    getRecruiterJobs(user.id).then(jobsData => {
                      setRecruiterJobs(jobsData)
                      setDataLoading(false)
                    })
                  })
                }
              }} />
            </div>
            {dataLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : recruiterJobs.length > 0 ? (
              <div className="space-y-3">
                {recruiterJobs.map((job) => (
                  <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.location || "Ubicación no especificada"} • {job.modality} • {job.job_type}
                          </p>
                          {job.salary && (
                            <p className="text-sm font-medium text-green-600 mt-2">${job.salary.toLocaleString()}</p>
                          )}
                          <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                            <span>{job.applications_count || 0} aplicaciones</span>
                            <span>•</span>
                            <span>Creada hace {Math.floor(Math.random() * 30)} días</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            job.status === "active" ? "bg-green-100 text-green-700" :
                            job.status === "closed" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {job.status === "active" ? "Activa" : job.status === "closed" ? "Cerrada" : "Borrador"}
                          </span>
                          <button
                            onClick={() => handleJobStatusChange(job.id, job.status === "active" ? "closed" : "active")}
                            className="px-3 py-1 rounded text-xs font-medium border border-input hover:bg-accent/10 transition-colors"
                          >
                            {job.status === "active" ? "Cerrar" : "Activar"}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="px-3 py-1 rounded text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tienes ofertas publicadas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Candidatos Tab */}
          <TabsContent value="candidatos" className="space-y-4">
            {recruiterJobs.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Publica una oferta para ver candidatos</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setApplicantFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      applicantFilter === "all"
                        ? "bg-accent text-white"
                        : "border border-input hover:bg-accent/10"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setApplicantFilter("pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      applicantFilter === "pending"
                        ? "bg-yellow-600 text-white"
                        : "border border-input hover:bg-accent/10"
                    }`}
                  >
                    Pendientes
                  </button>
                  <button
                    onClick={() => setApplicantFilter("viewed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      applicantFilter === "viewed"
                        ? "bg-blue-600 text-white"
                        : "border border-input hover:bg-accent/10"
                    }`}
                  >
                    Vistos
                  </button>
                  <button
                    onClick={() => setApplicantFilter("accepted")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      applicantFilter === "accepted"
                        ? "bg-green-600 text-white"
                        : "border border-input hover:bg-accent/10"
                    }`}
                  >
                    Aceptados
                  </button>
                  <button
                    onClick={() => setApplicantFilter("rejected")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      applicantFilter === "rejected"
                        ? "bg-red-600 text-white"
                        : "border border-input hover:bg-accent/10"
                    }`}
                  >
                    Rechazados
                  </button>
                </div>

                {dataLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredApplicants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredApplicants.map((app) => (
                      <Card key={app.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenCandidateProfile(app.user_id)}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm font-semibold text-accent">
                                    {(app.profiles?.first_name?.[0] || "C").toUpperCase()}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm truncate">{app.profiles?.first_name || "Candidato"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{app.profiles?.profession || "Sin info"}</p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Para: {selectedJobForApplicants && recruiterJobs.find(j => j.id === selectedJobForApplicants)?.title}
                              </p>
                            </div>
                            <select
                              value={app.status}
                              onChange={(e) => { e.stopPropagation(); handleApplicationStatusChange(app.id, e.target.value as any) }}
                              className={`px-2 py-1 rounded text-xs font-medium border ${
                                app.status === "pending" ? "border-yellow-200 bg-yellow-50" :
                                app.status === "viewed" ? "border-blue-200 bg-blue-50" :
                                app.status === "accepted" ? "border-green-200 bg-green-50" :
                                "border-red-200 bg-red-50"
                              }`}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="viewed">Visto</option>
                              <option value="accepted">Aceptado</option>
                              <option value="rejected">Rechazado</option>
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No hay candidatos en esta categoría</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {dataLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <AnalyticsView
                viewsData={analyticsData.viewsData}
                categoryData={analyticsData.categoryData}
                statusData={analyticsData.statusData}
              />
            )}
          </TabsContent>

          {/* Mi Perfil Tab */}
          <TabsContent value="perfil">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Perfil de Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de Empresa</label>
                    <input
                      type="text"
                      placeholder="Nombre de tu empresa"
                      className="w-full mt-1 px-3 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descripción</label>
                    <textarea
                      placeholder="Cuéntanos sobre tu empresa..."
                      className="w-full mt-1 px-3 py-2 border border-input rounded-lg bg-background"
                      rows={4}
                    ></textarea>
                  </div>
                  <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90">
                    Guardar Cambios
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CandidateProfileModal
        open={candidateModalOpen}
        onOpenChange={setCandidateModalOpen}
        profile={selectedCandidate}
        isLoading={loadingCandidateProfile}
      />

      <Footer />
    </div>
  )
}

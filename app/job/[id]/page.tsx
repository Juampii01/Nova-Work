"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ApplyButton } from "@/components/apply-button"
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Heart,
  Share2,
  MessageCircle,
  Verified,
  Building,
  Flag,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { getJob, getSimilarJobs, saveJob } from "@/lib/supabase/database"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id as string

  const [job, setJob] = useState<any>(null)
  const [similarJobs, setSimilarJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isContactLoading, setIsContactLoading] = useState(false)
  const { user } = useAuth();
  const isOwnJob = user?.id && job?.posted_by === user.id;

  useEffect(() => {
    loadJobData()
    registerJobView()
    syncSavedState()
  }, [jobId])

  // Sincronizar estado de favorito al cargar
  const syncSavedState = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("saved_jobs")
          .select("id")
          .eq("user_id", user.id)
          .eq("job_id", jobId)
          .maybeSingle()
        setIsSaved(!!data)
      } else {
        setIsSaved(false)
      }
    } catch (err) {
      setIsSaved(false)
    }
  }

  const loadJobData = async () => {
    setLoading(true)
    const jobData = await getJob(jobId)
    if (jobData) {
      setJob(jobData)
      const similar = await getSimilarJobs(jobData.category, jobId)
      setSimilarJobs(similar)
    }
    setLoading(false)
  }

    // Registrar vista en job_views
    const registerJobView = async () => {
      if (!jobId) return
      let userId = null
      let sessionId = null
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id || null
        sessionId = (typeof window !== 'undefined' ? window.localStorage.getItem('session_id') : null)
        if (!sessionId && typeof window !== 'undefined') {
          sessionId = crypto.randomUUID()
          window.localStorage.setItem('session_id', sessionId)
        }
      } catch {}
      // Deduplicar por 24h
      await fetch('/api/job-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId, sessionId })
      })
    }
  const handleSave = async () => {
    // Bloquear si el trabajo es del usuario actual
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && job?.posted_by === user.id) {
        alert("No puedes guardar tu propio aviso");
        return;
      }
      await saveJob(jobId); // Toggle en base
      await syncSavedState(); // Refresca estado real desde la base
    } catch (err) {
      console.error("Error en handleSave:", err)
    }
  }

  const handleContact = async () => {
    setIsContactLoading(true)
    // Obtener owner del job
    const ownerId = job?.posted_by
    if (!ownerId) {
      setIsContactLoading(false)
      return
    }
    // Obtener usuario autenticado directo de Supabase
    let userId = null
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    } catch {}
    if (!userId || userId === ownerId) {
      setIsContactLoading(false)
      return
    }
    // Buscar conversación existente
    const convoRes = await fetch(`/api/conversation?user1=${userId}&user2=${ownerId}`)
    const { conversationId } = await convoRes.json()
    // Si no existe, crear mensaje inicial
    if (!conversationId) {
      await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: userId, recipientId: ownerId, content: `Hola, estoy interesado en tu oferta: ${job.title}`, jobId })
      })
    }
    // Redirigir a /messages con el thread del owner
    router.push(`/messages?user=${ownerId}`)
    setIsContactLoading(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `${job.title} en ${job.company}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado al portapapeles")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Trabajo no encontrado</h2>
              <p className="text-muted-foreground mb-4">El trabajo que buscas no existe</p>
              <Link href="/feed">
                <Button>Volver al feed</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/feed" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a ofertas
          </Link>

          {/* Job Header */}
          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="font-heading font-bold text-3xl lg:text-4xl text-balance">{job.title}</h1>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Publicado por: {job.owner_profile?.full_name || job.owner_profile?.username || 'Usuario'}
                        </span>
                        {job.companies?.name && (
                          <span className="text-xs text-muted-foreground">Organización: {job.companies.name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{job.category}</span>
                      </Badge>
                      <Badge variant="outline">{job.modality}</Badge>
                      <Badge variant="outline">{job.job_type}</Badge>
                      {job.salary_range && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{job.salary_range}</span>
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location_text}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Publicado hace{" "}
                          {Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                    {!isOwnJob && <ApplyButton jobId={jobId} />}
                    <div className="flex gap-2">
                      {!isOwnJob && (
                        <Button variant="outline" size="icon" onClick={handleSave} className="bg-transparent">
                          <Heart className={`w-4 h-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
                        </Button>
                      )}
                      {isOwnJob && (
                        <Link href={`/job/${jobId}/edit`}>
                          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">Editar</Button>
                        </Link>
                      )}
                      <Button variant="outline" size="icon" onClick={handleShare} className="bg-transparent">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-xl mb-4">Descripción del puesto</h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Why Apply */}
              <Card className="border-l-4 border-l-accent bg-accent/2">
                <CardContent className="p-6">
                  <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    ¿Por qué postularte?
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1">✦</span>
                      <span className="text-muted-foreground">Empresa verificada con reputación comprobada</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1">✦</span>
                      <span className="text-muted-foreground">Oportunidad de crecimiento profesional</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1">✦</span>
                      <span className="text-muted-foreground">Compensación competitiva y beneficios</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-heading font-semibold text-xl mb-4">Requisitos</h2>
                    <ul className="space-y-2">
                      {(job.requirements as string[]).map((req: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-heading font-semibold text-xl mb-4">Beneficios</h2>
                    <ul className="space-y-2">
                      {(job.benefits as string[]).map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-heading font-semibold text-xl mb-4">Ofertas similares</h2>
                    <div className="space-y-4">
                      {similarJobs.map((similarJob) => (
                        <Link key={similarJob.id} href={`/job/${similarJob.id}`}>
                          <div className="border rounded-lg p-4 hover:bg-muted/50 hover:border-accent/50 transition-all cursor-pointer">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className="font-medium hover:text-accent transition-colors leading-snug">{similarJob.title}</h3>
                                  <p className="text-sm text-muted-foreground">{similarJob.company}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {similarJob.modality && (
                                  <Badge variant="outline" className="text-xs">
                                    {similarJob.modality}
                                  </Badge>
                                )}
                                {similarJob.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {similarJob.type}
                                  </Badge>
                                )}
                                {(similarJob.salary_min || similarJob.salary_max) && (
                                  <Badge className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                    {similarJob.salary_min && `$${similarJob.salary_min}`}
                                    {similarJob.salary_min && similarJob.salary_max && " - "}
                                    {similarJob.salary_max && `$${similarJob.salary_max}`}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                <span>{similarJob.location_text || "Ubicación no especificada"}</span>
                                <span className="text-muted-foreground/60">{similarJob.postedAt || "Recientemente"}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Sobre la empresa</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <Link href={job.companies?.slug ? `/company/${job.companies.slug}` : "#"} className="hover:text-accent transition-colors">
                          <p className="font-medium hover:underline">{job.company}</p>
                        </Link>
                        {job.is_verified && (
                          <div className="flex items-center space-x-1">
                            <Verified className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600">Verificada</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <Link href={job.companies?.slug ? `/company/${job.companies.slug}` : "#"} className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver empresa
                      </Button>
                    </Link>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Ubicación</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sector</span>
                        <span className="capitalize">{job.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Empleados</span>
                        <span>10-50</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Estadísticas</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vistas</span>
                      <span>{job.views ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Postulaciones</span>
                      <span>{job.applications_count ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Guardado por</span>
                      <span>{job.saved_count ?? 0} personas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">¿Te interesa?</h3>
                  <div className="space-y-3">
                    <Button onClick={handleContact} className="w-full" disabled={isContactLoading}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {isContactLoading ? "Contactando..." : "Contactar ahora"}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleSave}>
                      <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-accent text-accent" : ""}`} />
                      {isSaved ? "Guardado" : "Guardar oferta"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Al contactar, tu perfil será visible para el empleador
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

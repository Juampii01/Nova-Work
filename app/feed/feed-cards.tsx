import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Heart, MessageCircle, Verified, Clock, DollarSign } from "lucide-react"
import type { Job as DBJob, Profile } from "@/lib/supabase/database"
import { useState, useEffect } from "react"
import { saveJob, getSavedJobs } from "@/lib/supabase/database"
import { useAuth } from "@/hooks/use-auth"

export function JobCard({
  job,
  isSaved = false,
  onToggleFavorite,
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
  isSaved?: boolean
  onToggleFavorite?: (jobId: string) => void
}) {
  return (
    <Card className="hover:shadow-2xl transition-shadow bg-gradient-to-br from-white/80 to-accent/10 dark:from-[#1a2f26]/80 dark:to-accent/10 backdrop-blur-xl animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/job/${job.id ?? ""}`} className="hover:text-accent transition-colors">
                  <h3 className="font-heading font-semibold text-lg animate-fade-in-up">{job.title || "Sin título"}</h3>
                </Link>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Publicado por: {job.companies?.name || "Usuario"}
                  </span>
                  {job.companies?.name && (
                    <span className="text-xs text-muted-foreground">Organización: {job.companies.name}</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite && onToggleFavorite(job.id)}
                className="text-muted-foreground hover:text-accent transition-all animate-fade-in"
                aria-label={isSaved ? "Quitar de favoritos" : "Agregar a favoritos"}
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
                    <span>{job.location_text || "Sin ubicación"}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{job.created_at ? new Date(job.created_at).toLocaleDateString() : ""}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground rounded-xl animate-fade-in">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/job/${job.id ?? ""}`}>
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

export function CandidateCard({ candidate }: { candidate: Profile }) {
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
                <Link href={`/u/${candidate.username || ""}`} className="hover:text-accent transition-colors">
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
                  <span>⭐ {typeof candidate.average_rating === "number" ? candidate.average_rating.toFixed(1) : "-"}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-foreground rounded-xl animate-fade-in">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contactar
                </Button>
                <Link href={`/u/${candidate.username || ""}`}>
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

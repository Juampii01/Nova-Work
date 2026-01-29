import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Heart, MessageCircle, Verified, Clock, DollarSign } from "lucide-react"
import type { Job as DBJob, Profile } from "@/lib/supabase/database"
import { useAuth } from "@/hooks/use-auth"

export function JobCard({ job, isSaved = false, onToggleFavorite }: {
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
  const { user } = useAuth();
  const isOwnJob = user?.id && job.posted_by === user.id;
  return (
    <div className="relative bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/10 p-8 flex flex-col gap-6 animate-fade-in-up hover:scale-[1.03] transition-transform duration-300">
      {/* Título y empresa */}
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0">
          <Link href={`/job/${job.id ?? ""}`} className="block group-hover:text-accent transition-colors">
            <h3 className="font-heading font-bold text-xl md:text-2xl truncate text-foreground leading-tight">
              {job.title || "Sin título"}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground font-medium">
              {job.companies?.name || "Usuario"}
            </span>
            {isOwnJob && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                <svg width="10" height="10" fill="currentColor" className="inline"><circle cx="5" cy="5" r="5"/></svg>
                Tu aviso
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isOwnJob && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite && onToggleFavorite(job.id)}
              className="text-muted-foreground hover:text-accent transition-all"
              aria-label={isSaved ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-accent text-accent" : ""}`} />
            </Button>
          )}
          {isOwnJob && (
            <Link href={`/job/${job.id}/edit`}>
              <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">Editar</Button>
            </Link>
          )}
        </div>
      </div>
      {/* Ubicación, tipo y modalidad */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80 mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 opacity-60" />
          <span className="truncate">{job.location_text || "Ubicación no especificada"}</span>
        </div>
        {job.job_type && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 opacity-60" />
            <span>{job.job_type}</span>
          </div>
        )}
        {job.modality && (
          <div className="flex items-center gap-1">
            <span>{job.modality}</span>
          </div>
        )}
      </div>
      {/* Descripción */}
      {job.description && (
        <p className="text-muted-foreground/90 text-base line-clamp-2 mb-2 font-normal">
          {job.description}
        </p>
      )}
      {/* Tags y salario */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {job.category && (
          <Badge variant="outline" className="text-xs font-medium rounded bg-muted/40 border-muted/30 text-muted-foreground/90">
            {job.category}
          </Badge>
        )}
        {(job.salary_min || job.salary_max) && (
          <Badge className="text-xs font-semibold rounded bg-green-50 text-green-700 border-green-200 px-2">
            <DollarSign className="w-3 h-3 mr-1 inline-block" />
            {job.salary_min
              ? `${job.salary_currency ?? "$"}${job.salary_min}`
              : ""}
            {(job.salary_min && job.salary_max) ? " - " : ""}
            {job.salary_max
              ? `${job.salary_currency ?? "$"}${job.salary_max}`
              : ""}
          </Badge>
        )}
      </div>
      {/* Acciones */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-muted/20">
        <Link href={`/job/${job.id ?? ""}`} className="w-full">
          <Button size="default" className="w-full font-semibold tracking-wide rounded-lg shadow-sm">
            Ver detalles
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function CandidateCard({ candidate }: { candidate: Profile }) {
  return (
    <div className="relative bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/10 p-8 flex flex-col gap-6 animate-fade-in-up hover:scale-[1.03] transition-transform duration-300">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 animate-fade-in">
          {candidate.avatar_url ? (
            <img
              src={candidate.avatar_url || "/placeholder.svg"}
              alt={candidate.full_name || ""}
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="font-semibold text-accent text-xl">{candidate.full_name?.charAt(0) || "?"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/u/${candidate.username || ""}`} className="hover:text-accent transition-colors">
            <h3 className="font-heading font-bold text-xl truncate text-foreground leading-tight">
              {candidate.full_name || "Usuario"}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base text-muted-foreground font-medium">
              {candidate.profession || "Profesional"}
            </span>
            {candidate.is_verified && <Verified className="w-4 h-4 text-accent animate-bounce" />}
            <Badge variant="secondary" className="text-xs bg-accent/10 text-accent font-medium animate-fade-in-up">
              Disponible
            </Badge>
          </div>
        </div>
      </div>
      {/* Ubicación y rating */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80 mb-2">
        {candidate.location_text && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 opacity-60" />
            <span>{candidate.location_text}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span>⭐ {typeof candidate.average_rating === "number" ? candidate.average_rating.toFixed(1) : "-"}</span>
        </div>
      </div>
      {/* Bio */}
      {candidate.bio && (
        <p className="text-muted-foreground/90 text-base line-clamp-2 mb-2 font-normal">
          {candidate.bio}
        </p>
      )}
      {/* Acciones */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-muted/20">
        <Button size="sm" variant="outline" className="bg-transparent text-muted-foreground hover:text-accent rounded-xl animate-fade-in shadow-none border-none">
          <MessageCircle className="w-4 h-4 mr-1" />
          Contactar
        </Button>
        <Link href={`/u/${candidate.username || ""}`}>
          <Button size="sm" className="rounded-xl bg-accent text-white hover:bg-accent/90 shadow-none">Ver perfil</Button>
        </Link>
      </div>
    </div>
  )
}

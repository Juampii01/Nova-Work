"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Briefcase, Award, MapPin, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { ChatModal } from "@/components/chat-modal"
import { useAuth } from "@/hooks/use-auth"

interface Skill {
  id: string
  name: string
  level: string
}

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  issue_date?: string
}

interface CandidateProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  profession?: string
  location_text?: string
  average_rating?: number
  total_reviews?: number
  skills?: Skill[]
  experience?: Experience[]
  certifications?: Certification[]
}

interface CandidateProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: CandidateProfile | null
  isLoading?: boolean
}

export function CandidateProfileModal({ open, onOpenChange, profile, isLoading }: CandidateProfileModalProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const { user } = useAuth()

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!profile) return null

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "C"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil del Candidato</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center text-3xl font-bold text-accent flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-html-element-for-component
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitial(profile.full_name)
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              {profile.profession && <p className="text-lg text-accent mt-1">{profile.profession}</p>}

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                {profile.location_text && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location_text}
                  </div>
                )}
                {profile.average_rating && (
                  <div>
                    ⭐ {profile.average_rating.toFixed(1)} ({profile.total_reviews} reviews)
                  </div>
                )}
              </div>

              <Button onClick={() => setChatOpen(true)} className="gap-2 mt-4">
                <MessageCircle className="w-4 h-4" />
                Contactar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          {profile.bio && (
            <div>
              <h3 className="font-semibold mb-2">Sobre el candidato</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-1">
                    {skill.name}
                    <span className="text-xs text-muted-foreground">({skill.level})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experiencia
              </h3>
              <div className="space-y-3">
                {profile.experience.map((exp) => (
                  <Card key={exp.id} className="border-0 bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          {exp.location && <p className="text-xs text-muted-foreground mt-1">{exp.location}</p>}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {new Date(exp.start_date).getFullYear()}{" "}
                          {exp.is_current ? "- Presente" : `- ${new Date(exp.end_date || "").getFullYear()}`}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{exp.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certificaciones
              </h3>
              <div className="space-y-2">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    </div>
                    {cert.issue_date && (
                      <span className="text-xs text-muted-foreground">{new Date(cert.issue_date).getFullYear()}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
          </div>
        </div>

        {user && profile && (
          <ChatModal
            open={chatOpen}
            onOpenChange={setChatOpen}
            candidateName={profile.full_name}
            candidateId={profile.id}
            currentUserId={user.id}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

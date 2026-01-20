"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Briefcase,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Target,
  Zap,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function RecommendationsPage() {
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "1.2 km",
      salary: "$90,000 - $120,000/año",
      match: 95,
      reason: "Coincide con tus habilidades en React y TypeScript",
      tags: ["React", "TypeScript", "Next.js"],
      posted: "Hace 2 horas",
      applicants: 12,
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "3.5 km",
      salary: "$70,000 - $95,000/año",
      match: 88,
      reason: "Tu portfolio muestra experiencia relevante en diseño",
      tags: ["Figma", "UI Design", "Prototipado"],
      posted: "Hace 1 día",
      applicants: 23,
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "5.0 km",
      salary: "$85,000 - $110,000/año",
      match: 82,
      reason: "Buscando tu nivel de experiencia (5+ años)",
      tags: ["Node.js", "React", "PostgreSQL"],
      posted: "Hace 3 días",
      applicants: 45,
    },
  ]

  const profileRecommendations = [
    {
      id: 1,
      title: "Agrega certificaciones",
      description: "Usuarios con certificaciones reciben 3x más vistas",
      impact: "Alto",
      action: "Agregar ahora",
      icon: Star,
    },
    {
      id: 2,
      title: "Completa tu experiencia laboral",
      description: "Falta agregar 2 trabajos anteriores según tu perfil de LinkedIn",
      impact: "Medio",
      action: "Completar",
      icon: Briefcase,
    },
    {
      id: 3,
      title: "Solicita recomendaciones",
      description: "Perfiles con 3+ recomendaciones tienen 60% más credibilidad",
      impact: "Alto",
      action: "Solicitar",
      icon: Users,
    },
    {
      id: 4,
      title: "Verifica tu identidad",
      description: "Perfiles verificados reciben 5x más mensajes de reclutadores",
      impact: "Crítico",
      action: "Verificar",
      icon: Target,
    },
  ]

  const networkRecommendations = [
    {
      id: 1,
      name: "María González",
      title: "Senior Product Manager",
      company: "TechCorp",
      mutualConnections: 5,
      reason: "Trabajó en proyectos similares",
      avatar: "MG",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      title: "Engineering Lead",
      company: "Design Studio",
      mutualConnections: 3,
      reason: "Comparte tus intereses en IA",
      avatar: "CR",
    },
    {
      id: 3,
      name: "Ana Martínez",
      title: "Frontend Architect",
      company: "StartupXYZ",
      mutualConnections: 8,
      reason: "Experta en React y Next.js",
      avatar: "AM",
    },
  ]

  const skillRecommendations = [
    { skill: "Machine Learning", demand: 95, salary: "+$15,000" },
    { skill: "AWS Cloud", demand: 88, salary: "+$12,000" },
    { skill: "Docker/K8s", demand: 82, salary: "+$10,000" },
    { skill: "GraphQL", demand: 75, salary: "+$8,000" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8" />
              <h1 className="text-4xl font-heading font-bold">Recomendaciones Inteligentes</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Basadas en tu perfil, comportamiento y tendencias del mercado, aquí están tus oportunidades personalizadas
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Job Recommendations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-accent" />
                  Trabajos Recomendados
                </h2>
                <p className="text-muted-foreground mt-1">Los mejores matches basados en tu perfil</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/feed">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobRecommendations.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full">
                      <Heart className="h-3 w-3 fill-current" />
                      <span className="text-xs font-semibold">{job.match}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>

                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-4">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <Zap className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      {job.reason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-muted-foreground">{job.applicants} postulantes</span>
                    <Button size="sm" asChild>
                      <Link href={`/job/${job.id}`}>Ver detalles</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Profile Improvements */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <Target className="h-6 w-6 text-accent" />
                Mejora tu Perfil
              </h2>
              <p className="text-muted-foreground mt-1">Recomendaciones para destacar ante reclutadores</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {profileRecommendations.map((rec) => (
                <Card key={rec.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <rec.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                        <Badge
                          variant={
                            rec.impact === "Crítico" ? "destructive" : rec.impact === "Alto" ? "default" : "secondary"
                          }
                        >
                          {rec.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        {rec.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Network Recommendations */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Personas que deberías conocer
              </h2>
              <p className="text-muted-foreground mt-1">Expande tu red profesional</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {networkRecommendations.map((person) => (
                <Card key={person.id} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {person.avatar}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{person.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{person.title}</p>
                  <p className="text-xs text-muted-foreground mb-3">{person.company}</p>
                  <p className="text-xs text-muted-foreground mb-4">{person.mutualConnections} conexiones en común</p>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-2 mb-4">
                    <p className="text-xs text-muted-foreground">{person.reason}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Conectar
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Skill Recommendations */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-accent" />
                Habilidades en Demanda
              </h2>
              <p className="text-muted-foreground mt-1">Aprende estas habilidades para aumentar tu valor</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {skillRecommendations.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-foreground">{item.skill}</h3>
                    <Badge variant="default" className="bg-green-500">
                      {item.salary}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Demanda del mercado</span>
                      <span className="font-semibold text-foreground">{item.demand}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.demand}%` }}
                      />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Ver cursos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

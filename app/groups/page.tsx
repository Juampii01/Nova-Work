"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Search,
  Plus,
  TrendingUp,
  MessageSquare,
  Lock,
  Globe,
  Crown,
  Star,
  Calendar,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  const myGroups = [
    {
      id: 1,
      name: "Desarrolladores Frontend Buenos Aires",
      members: 1247,
      posts: 89,
      category: "Tecnología",
      privacy: "public",
      joined: true,
      role: "member",
      avatar: "DF",
      lastActivity: "Hace 2 horas",
    },
    {
      id: 2,
      name: "Diseñadores UX/UI Argentina",
      members: 856,
      posts: 124,
      category: "Diseño",
      privacy: "public",
      joined: true,
      role: "admin",
      avatar: "DU",
      lastActivity: "Hace 5 horas",
    },
    {
      id: 3,
      name: "Freelancers Zona Norte",
      members: 432,
      posts: 67,
      category: "Networking",
      privacy: "private",
      joined: true,
      role: "moderator",
      avatar: "FZ",
      lastActivity: "Hace 1 día",
    },
  ]

  const suggestedGroups = [
    {
      id: 4,
      name: "Full Stack Developers LATAM",
      members: 2145,
      posts: 342,
      category: "Tecnología",
      privacy: "public",
      joined: false,
      avatar: "FS",
      description: "Comunidad de desarrolladores full stack de Latinoamérica",
    },
    {
      id: 5,
      name: "Product Managers Argentina",
      members: 678,
      posts: 156,
      category: "Management",
      privacy: "public",
      joined: false,
      avatar: "PM",
      description: "Grupo para PMs compartiendo experiencias y oportunidades",
    },
    {
      id: 6,
      name: "Marketing Digital CABA",
      members: 1123,
      posts: 289,
      category: "Marketing",
      privacy: "private",
      joined: false,
      avatar: "MD",
      description: "Profesionales de marketing digital de Buenos Aires",
    },
  ]

  const popularTopics = [
    { name: "React & Next.js", count: 234 },
    { name: "Trabajo Remoto", count: 189 },
    { name: "Salarios 2025", count: 156 },
    { name: "Consejos de Carrera", count: 143 },
    { name: "Freelancing", count: 128 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-heading font-bold mb-4">Grupos Profesionales</h1>
                <p className="text-lg text-primary-foreground/90">
                  Conectate con profesionales de tu industria y expande tu red
                </p>
              </div>
              <Button size="lg" variant="secondary">
                <Plus className="mr-2 h-5 w-5" />
                Crear Grupo
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar grupos por nombre, categoría o tema..."
                  className="pl-12 h-12 bg-card text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="my-groups" className="space-y-8">
            <TabsList>
              <TabsTrigger value="my-groups">Mis Grupos</TabsTrigger>
              <TabsTrigger value="discover">Descubrir</TabsTrigger>
              <TabsTrigger value="trending">Tendencias</TabsTrigger>
            </TabsList>

            {/* My Groups Tab */}
            <TabsContent value="my-groups" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.map((group) => (
                  <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{group.avatar}</span>
                        </div>
                        <div>
                          {group.privacy === "private" ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {group.role === "admin" && (
                        <Badge variant="default" className="bg-accent">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {group.role === "moderator" && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Mod
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-foreground mb-2">{group.name}</h3>
                    <Badge variant="outline" className="mb-4">
                      {group.category}
                    </Badge>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members.toLocaleString()} miembros
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {group.posts} posts
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Última actividad: {group.lastActivity}</p>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href={`/groups/${group.id}`}>Ver Grupo</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestedGroups.map((group) => (
                  <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">{group.avatar}</span>
                      </div>
                      {group.privacy === "private" ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-foreground mb-2">{group.name}</h3>
                    <Badge variant="outline" className="mb-3">
                      {group.category}
                    </Badge>

                    <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {group.posts}
                      </span>
                    </div>

                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Unirse al Grupo
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-bold mb-4">Debates Populares</h2>
                    <div className="space-y-4">
                      {[
                        {
                          title: "¿Cuál es el mejor framework frontend en 2025?",
                          group: "Desarrolladores Frontend Buenos Aires",
                          replies: 45,
                          views: 1234,
                          author: "Carlos M.",
                          time: "Hace 3 horas",
                        },
                        {
                          title: "Experiencias con trabajo 100% remoto",
                          group: "Freelancers Zona Norte",
                          replies: 67,
                          views: 2145,
                          author: "Ana R.",
                          time: "Hace 5 horas",
                        },
                        {
                          title: "Cómo negociar tu salario en tech",
                          group: "Product Managers Argentina",
                          replies: 89,
                          views: 3456,
                          author: "Juan P.",
                          time: "Hace 1 día",
                        },
                      ].map((topic, index) => (
                        <div key={index} className="pb-4 border-b last:border-0">
                          <h3 className="font-semibold text-foreground mb-2">{topic.title}</h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>{topic.group}</span>
                              <span>{topic.author}</span>
                              <span>{topic.time}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {topic.replies}
                              </span>
                              <span>{topic.views} vistas</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-bold mb-4">Eventos de Grupos</h2>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Meetup Frontend: Estado del Arte 2025",
                          group: "Desarrolladores Frontend Buenos Aires",
                          date: "15 Feb 2025",
                          attendees: 45,
                        },
                        {
                          title: "Workshop: Portfolio para Diseñadores",
                          group: "Diseñadores UX/UI Argentina",
                          date: "20 Feb 2025",
                          attendees: 32,
                        },
                      ].map((event, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="w-16 h-16 rounded-lg bg-accent/10 flex flex-col items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-accent mb-1" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{event.group}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{event.date}</span>
                              <span>{event.attendees} asistentes</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Temas Populares
                    </h2>
                    <div className="space-y-3">
                      {popularTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{topic.name}</span>
                          <Badge variant="secondary">{topic.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Recursos Compartidos
                    </h2>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        Guía de Salarios Tech 2025
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        Template CV Profesional
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        Checklist Entrevistas
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

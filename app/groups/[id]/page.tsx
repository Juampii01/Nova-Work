"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageSquare,
  Globe,
  Bell,
  BellOff,
  Settings,
  Share2,
  ThumbsUp,
  Send,
  ImageIcon,
  Calendar,
  FileText,
  LinkIcon,
} from "lucide-react"
import { useState } from "react"

export default function GroupDetailPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [newPost, setNewPost] = useState("")

  const posts = [
    {
      id: 1,
      author: {
        name: "Carlos Martínez",
        role: "Senior Frontend Developer",
        avatar: "CM",
        verified: true,
      },
      content:
        "¿Alguien tiene experiencia migrando de Create React App a Vite? Estoy evaluando opciones para un proyecto grande y me gustaría conocer sus experiencias.",
      timestamp: "Hace 2 horas",
      likes: 12,
      comments: 8,
      image: null,
    },
    {
      id: 2,
      author: {
        name: "Ana Rodríguez",
        role: "UI/UX Designer",
        avatar: "AR",
        verified: false,
      },
      content:
        "Compartiendo un artículo interesante sobre las nuevas tendencias de diseño en 2025. Vale la pena leerlo!",
      timestamp: "Hace 5 horas",
      likes: 23,
      comments: 5,
      image: "/placeholder.svg?height=300&width=600",
    },
  ]

  const members = [
    { name: "Carlos Martínez", role: "Senior Frontend Developer", avatar: "CM" },
    { name: "Ana Rodríguez", role: "UI/UX Designer", avatar: "AR" },
    { name: "Juan López", role: "Full Stack Developer", avatar: "JL" },
    { name: "María García", role: "Product Manager", avatar: "MG" },
  ]

  const upcomingEvents = [
    {
      title: "Meetup Frontend: Estado del Arte 2025",
      date: "15 Feb 2025 - 19:00",
      attendees: 45,
    },
    {
      title: "Workshop: Testing con React Testing Library",
      date: "22 Feb 2025 - 18:00",
      attendees: 32,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Group Header */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-3xl font-bold">DF</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-heading font-bold">Desarrolladores Frontend Buenos Aires</h1>
                    <Globe className="h-5 w-5" />
                  </div>
                  <p className="text-primary-foreground/90 mb-4">
                    Comunidad de desarrolladores frontend de Buenos Aires compartiendo conocimientos y oportunidades
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      1,247 miembros
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      89 posts
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                  {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                </Button>
                <Button variant="secondary" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="feed">
                <TabsList>
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="about">Acerca de</TabsTrigger>
                  <TabsTrigger value="members">Miembros</TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="space-y-6 mt-6">
                  {/* Create Post */}
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Compartí algo con el grupo..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Imagen
                          </Button>
                          <Button variant="ghost" size="sm">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Link
                          </Button>
                        </div>
                        <Button>
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Posts */}
                  {posts.map((post) => (
                    <Card key={post.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">{post.author.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                              <p className="text-sm text-muted-foreground">{post.author.role}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                          </div>
                          <p className="text-foreground mb-4">{post.content}</p>
                          {post.image && (
                            <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full rounded-lg mb-4" />
                          )}
                          <div className="flex items-center gap-4 pt-4 border-t">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-bold mb-4">Acerca del Grupo</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Grupo creado para conectar desarrolladores frontend de Buenos Aires y alrededores. Compartimos
                        conocimientos, experiencias, oportunidades laborales y organizamos meetups presenciales.
                      </p>
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold text-foreground mb-2">Reglas del Grupo</h3>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Respetar a todos los miembros</li>
                          <li>No spam ni promociones no autorizadas</li>
                          <li>Mantener conversaciones profesionales</li>
                          <li>Compartir contenido relevante y de calidad</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-heading font-bold mb-4">Miembros</h2>
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-bold text-primary text-sm">{member.avatar}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Perfil
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  Próximos Eventos
                </h2>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="pb-4 border-b last:border-0">
                      <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                      <p className="text-sm text-muted-foreground">{event.attendees} asistentes confirmados</p>
                      <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                        Confirmar Asistencia
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Recursos
                </h2>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    Guía de React Hooks
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    Mejores Prácticas CSS
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    Performance Web Checklist
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

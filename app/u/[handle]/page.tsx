"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import AdvancedReviews from "@/components/advanced-reviews"
import { getProfileByUsername, connectWithUser } from "@/lib/supabase/database"
import {
  MapPin,
  Star,
  MessageCircle,
  UserPlus,
  Verified,
  Briefcase,
  Award,
  ArrowLeft,
  Flag,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const handle = params.handle as string

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [handle])

  const loadProfile = async () => {
    setLoading(true)
    const profile = await getProfileByUsername(handle)
    if (profile) {
      setUser(profile)
    }
    setLoading(false)
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    const success = await connectWithUser(user.id)
    if (success) {
      setIsConnected(true)
    }
    setIsConnecting(false)
  }

  const handleContact = () => {
    router.push(`/chat?user=${user.id}`)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Perfil no encontrado</h2>
              <p className="text-muted-foreground mb-4">El usuario que buscas no existe</p>
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
            Volver a candidatos
          </Link>

          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                  <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-accent">{user.full_name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center space-x-2 justify-center lg:justify-start">
                      <h1 className="font-heading font-bold text-2xl">{user.full_name}</h1>
                      {user.is_verified && <Verified className="w-5 h-5 text-accent" />}
                    </div>
                    <p className="text-lg text-muted-foreground">{user.profession}</p>
                    <div className="flex items-center space-x-4 mt-2 justify-center lg:justify-start text-sm text-muted-foreground">
                      {user.location_text && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location_text}</span>
                        </div>
                      )}
                      {user.average_rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{user.average_rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-6">
                  {user.bio && (
                    <div>
                      <h2 className="font-heading font-semibold text-lg mb-2">Acerca de</h2>
                      <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  {user.skills && user.skills.length > 0 && (
                    <div>
                      <h3 className="font-heading font-semibold mb-3">Habilidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Experiencia</span>
                      <p className="font-medium">{user.experience_years} años</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tarifa por hora</span>
                      <p className="font-medium">${user.hourly_rate}/hora</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleConnect} disabled={isConnecting || isConnected} className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isConnecting ? "Conectando..." : isConnected ? "Conectado" : "Conectar"}
                    </Button>
                    <Button onClick={handleContact} variant="outline" className="flex-1 bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="bg-transparent">
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

          {/* Profile Content */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="experience">Experiencia</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <AdvancedReviews userId={user.id} canLeaveReview={true} />
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-6">Experiencia laboral</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Carpintero Senior</h4>
                        <p className="text-muted-foreground">Mueblería San Telmo</p>
                        <p className="text-sm text-muted-foreground">2018 - Presente • 6 años</p>
                        <p className="text-sm mt-2">
                          Especializado en muebles a medida y restauración. Responsable de proyectos completos desde
                          diseño hasta instalación.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Carpintero</h4>
                        <p className="text-muted-foreground">Taller Independiente</p>
                        <p className="text-sm text-muted-foreground">2015 - 2018 • 3 años</p>
                        <p className="text-sm mt-2">
                          Trabajos de carpintería general, reparaciones y proyectos personalizados para clientes
                          particulares.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-6">Certificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Certificación en Carpintería Avanzada</p>
                        <p className="text-sm text-muted-foreground">Instituto Técnico Buenos Aires • 2017</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Curso de Seguridad Laboral</p>
                        <p className="text-sm text-muted-foreground">UOCRA • 2019</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-6">Trabajos realizados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">Imagen del proyecto {item}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Muebles de cocina a medida</h4>
                          <p className="text-sm text-muted-foreground">
                            Diseño y fabricación completa de muebles de cocina en madera maciza.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}

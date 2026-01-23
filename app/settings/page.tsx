"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LocationInput, LocationData } from "@/components/location-input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { User, MapPin, Bell, Shield, CreditCard, Trash2, Save, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateProfile, getProfile } from "@/lib/supabase/database"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newJobs: true,
    messages: true,
    marketing: false,
  })
  const [privacy, setPrivacy] = useState({
    hideDistance: false,
    profileVisible: true,
  })
  const [location, setLocation] = useState<LocationData>({
    city: "",
    region: "",
    country: "",
    lat: null,
    lng: null,
    raw: "",
  })
  const [plan, setPlan] = useState("free")
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient()

        // Supabase not configured (missing env vars). Keep page usable.
        if (!supabase) {
          setUserId(null)
          setProfile(null)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUserId(user.id)
          const profileData = await getProfile(user.id)
          setProfile(profileData)
        } else {
          setUserId(null)
          setProfile(null)
        }
      } catch (error) {
        console.warn("[Settings] Failed to load profile", error)
        setUserId(null)
        setProfile(null)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!userId) return

    try {
      await updateProfile(userId, {
        location_text: location.raw,
        city: location.city,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
      })
      alert("Configuración guardada")
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      alert("Error al guardar configuración")
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        const supabase = createClient()
        if (!supabase) {
          alert("Supabase no está configurado en este entorno (faltan variables de entorno).")
          return
        }

        // NOTE: auth.admin requiere service role y debe ejecutarse en un servidor.
        // En el browser no es seguro ni posible. Implementar un endpoint seguro para eliminar cuentas.
        alert("Eliminar cuenta requiere un endpoint del servidor (admin API). Por ahora no está habilitado en local.")
        return
      } catch (error) {
        console.error("[v0] Error deleting account:", error)
        alert("Error al eliminar cuenta")
      }
    }
  }

  const handleCancelPlan = () => {
    if (confirm("¿Estás seguro de que querés cancelar tu plan Pro?")) {
      setPlan("free")
      alert("Plan cancelado. Seguirás teniendo acceso hasta el final del período de facturación.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl">Configuración</h1>
            <p className="text-muted-foreground mt-2">Administrá tu cuenta y preferencias de Nova Work</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="location">Ubicación</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="privacy">Privacidad</TabsTrigger>
              <TabsTrigger value="billing">Facturación</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Información personal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" defaultValue={profile?.firstName || "Juan"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" defaultValue={profile?.lastName || "Pérez"} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile?.email || "juan@example.com"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" defaultValue={profile?.phone || "+54 11 1234-5678"} />
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cambiar contraseña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    Actualizar contraseña
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Ubicación guardada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LocationInput value={location} onChange={setLocation} />
                  <div className="space-y-2">
                    <Label>Radio de búsqueda predeterminado</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 km</SelectItem>
                        <SelectItem value="3">3 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar ubicación
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Preferencias de notificaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Nuevos empleos cercanos</p>
                      <p className="text-sm text-muted-foreground">
                        Recibí notificaciones cuando aparezcan empleos en tu zona
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newJobs}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newJobs: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Mensajes y contactos</p>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones cuando recibas mensajes o solicitudes de contacto
                      </p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Comunicaciones de marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Recibí tips, novedades y ofertas especiales de Nova Work
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Configuración de privacidad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Ocultar distancia exacta</p>
                      <p className="text-sm text-muted-foreground">
                        Mostrar ubicación aproximada en lugar de distancia precisa
                      </p>
                    </div>
                    <Switch
                      checked={privacy.hideDistance}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, hideDistance: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Perfil visible en búsquedas</p>
                      <p className="text-sm text-muted-foreground">Permitir que otros usuarios encuentren tu perfil</p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Plan actual</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold capitalize">{plan === "free" ? "Plan Gratuito" : "Plan Pro"}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan === "free" ? "Acceso básico a Nova Work" : "Acceso completo con funciones premium"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{plan === "free" ? "$0" : "$2.990"}</p>
                      <p className="text-sm text-muted-foreground">por mes</p>
                    </div>
                  </div>

                  {plan === "free" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Actualizá a Pro para acceder a funciones premium</p>
                      <Button className="w-full">Actualizar a Pro</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Tu próxima facturación es el 15 de febrero de 2025
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Cambiar método de pago
                        </Button>
                        <Button variant="outline" onClick={handleCancelPlan} className="flex-1 bg-transparent">
                          Cancelar plan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Zona de peligro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Eliminar cuenta</p>
                  <p className="text-sm text-muted-foreground">Eliminá permanentemente tu cuenta y todos tus datos</p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

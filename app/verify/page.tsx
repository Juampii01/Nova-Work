"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, Camera, CheckCircle, Clock, AlertCircle, Star, Users, Zap, FileText } from "lucide-react"

export default function VerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<"not_started" | "pending" | "approved" | "rejected">(
    "not_started",
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleStartVerification = async () => {
    setIsUploading(true)
    setVerificationStatus("pending")

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setIsUploading(false)
    // Simulate approval after a delay
    setTimeout(() => {
      setVerificationStatus("approved")
    }, 2000)
  }

  const benefits = [
    {
      icon: Star,
      title: "Mayor visibilidad",
      description: "Tu perfil aparece primero en las búsquedas",
    },
    {
      icon: Users,
      title: "Más confianza",
      description: "Los empleadores prefieren perfiles verificados",
    },
    {
      icon: Zap,
      title: "Respuestas más rápidas",
      description: "Recibís contactos de calidad más frecuentemente",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl">Verificación de identidad</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Verificá tu identidad para generar más confianza y obtener mejores oportunidades laborales
            </p>
          </div>

          {/* Status Card */}
          <Card className="border-2 border-accent/20">
            <CardContent className="p-8">
              {verificationStatus === "not_started" && (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-heading font-semibold text-2xl">¿Listo para verificarte?</h2>
                    <p className="text-muted-foreground">
                      El proceso es simple y seguro. Solo necesitás tu DNI y unos minutos.
                    </p>
                  </div>
                  <Button onClick={handleStartVerification} size="lg" className="px-8">
                    <Shield className="w-5 h-5 mr-2" />
                    Iniciar verificación
                  </Button>
                </div>
              )}

              {verificationStatus === "pending" && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-heading font-semibold text-2xl">Verificación en proceso</h2>
                    <p className="text-muted-foreground">
                      Estamos revisando tu documentación. Te notificaremos cuando esté lista.
                    </p>
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                      <p className="text-sm text-muted-foreground">Subiendo documentos... {uploadProgress}%</p>
                    </div>
                  )}
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Tiempo estimado: 24-48 horas
                  </Badge>
                </div>
              )}

              {verificationStatus === "approved" && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-heading font-semibold text-2xl text-green-800">¡Verificación completada!</h2>
                    <p className="text-muted-foreground">
                      Tu perfil ahora tiene el badge de verificado. Esto te dará más visibilidad y confianza.
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Perfil verificado
                  </Badge>
                </div>
              )}

              {verificationStatus === "rejected" && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-heading font-semibold text-2xl text-red-800">Verificación rechazada</h2>
                    <p className="text-muted-foreground">
                      No pudimos verificar tu identidad. Revisá los documentos y volvé a intentarlo.
                    </p>
                  </div>
                  <Button
                    onClick={() => setVerificationStatus("not_started")}
                    variant="outline"
                    className="bg-transparent"
                  >
                    Intentar nuevamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo funciona la verificación?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">1. Subí tu DNI</h3>
                    <p className="text-sm text-muted-foreground">
                      Foto clara del frente y dorso de tu documento de identidad
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2. Tomá una selfie</h3>
                    <p className="text-sm text-muted-foreground">
                      Foto tuya sosteniendo el DNI para verificar que coincida
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">3. Esperá la aprobación</h3>
                    <p className="text-sm text-muted-foreground">
                      Revisamos tu documentación en 24-48 horas y te notificamos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold">Tu información está segura</h3>
                  <p className="text-sm text-muted-foreground">
                    Usamos encriptación de nivel bancario para proteger tus datos. Tu información personal nunca se
                    comparte con terceros y solo se usa para verificar tu identidad. Podés eliminar tus datos en
                    cualquier momento desde la configuración de tu cuenta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-accent">95%</p>
              <p className="text-sm text-muted-foreground">de usuarios verificados consiguen trabajo más rápido</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-accent">3x</p>
              <p className="text-sm text-muted-foreground">más contactos que perfiles sin verificar</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-accent">24h</p>
              <p className="text-sm text-muted-foreground">tiempo promedio de verificación</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Rocket, Users, Zap, Shield } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function BetaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      profession: formData.get("profession") as string,
      reason: formData.get("reason") as string,
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("beta_requests").insert([
        {
          full_name: data.name,
          email: data.email,
          profession: data.profession,
          reason: data.reason,
          status: "pending",
        },
      ])

      if (error) throw error

      setSubmitted(true)
      toast.success("¡Solicitud enviada!", {
        description: "Te contactaremos pronto con acceso a la beta",
      })
    } catch (error) {
      console.error("[v0] Error submitting beta request:", error)
      toast.error("Error al enviar la solicitud", {
        description: "Por favor intenta nuevamente",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4">Programa Beta Privado</Badge>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">Sé de los primeros en usar Nova Work</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a nuestro programa beta y ayuda a dar forma al futuro del networking profesional local
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Rocket className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Acceso anticipado</CardTitle>
              <CardDescription>Sé el primero en probar todas las nuevas funciones antes que nadie</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Comunidad exclusiva</CardTitle>
              <CardDescription>Conecta con otros beta testers y profesionales innovadores</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Influencia el producto</CardTitle>
              <CardDescription>Tu feedback directo ayudará a construir las funciones que necesitas</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Ventajas permanentes</CardTitle>
              <CardDescription>Los beta testers obtienen beneficios exclusivos de por vida</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {!submitted ? (
          <Card>
            <CardHeader>
              <CardTitle>Solicitar acceso a la beta</CardTitle>
              <CardDescription>
                Completa el formulario y te contactaremos con tu invitación en las próximas 48 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" name="name" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profesión / Industria *</Label>
                  <Input
                    id="profession"
                    name="profession"
                    placeholder="Ej: Desarrollador, Diseñador, Marketing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">¿Por qué quieres unirte a la beta? *</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Cuéntanos qué te interesa de Nova Work y cómo planeas usar la plataforma..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium">Como beta tester obtendrás:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Acceso gratuito al plan Pro por 6 meses
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Badge de "Miembro Fundador" en tu perfil
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Descuento del 50% de por vida en planes premium
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      Invitaciones a eventos exclusivos
                    </li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando solicitud..." : "Solicitar acceso a la beta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-2xl mb-2">¡Solicitud recibida!</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Gracias por tu interés en Nova Work. Revisaremos tu solicitud y te enviaremos una invitación a tu email
                en las próximas 48 horas.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Enviar otra solicitud
                </Button>
                <Button onClick={() => (window.location.href = "/")}>Volver al inicio</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Tienes preguntas sobre el programa beta?{" "}
            <a href="mailto:beta@novawork.com" className="text-primary hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

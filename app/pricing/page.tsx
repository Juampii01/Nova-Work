"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle, X, Star, Shield, Users, Crown, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Para empezar a explorar",
      price: { monthly: 0, yearly: 0 },
      badge: null,
      features: [
        { name: "10 vistas por día", included: true },
        { name: "5 contactos por mes", included: true },
        { name: "Búsqueda básica", included: true },
        { name: "Perfil básico", included: true },
        { name: "Soporte por email", included: true },
        { name: "Badge verificado", included: false },
        { name: "Contactos ilimitados", included: false },
        { name: "Prioridad en búsquedas", included: false },
        { name: "Métricas avanzadas", included: false },
        { name: "Soporte prioritario", included: false },
      ],
      cta: "Empezar gratis",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Para profesionales activos",
      price: { monthly: 2990, yearly: 29900 },
      badge: "Más popular",
      features: [
        { name: "Vistas ilimitadas", included: true },
        { name: "Contactos ilimitados", included: true },
        { name: "Badge verificado incluido", included: true },
        { name: "Prioridad en búsquedas", included: true },
        { name: "Perfil destacado", included: true },
        { name: "Métricas básicas", included: true },
        { name: "Chat prioritario", included: true },
        { name: "Soporte prioritario", included: true },
        { name: "Dashboard empresarial", included: false },
        { name: "Múltiples ofertas", included: false },
      ],
      cta: "Probar 7 días gratis",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Para reclutadores y empresas",
      price: { monthly: 9990, yearly: 99900 },
      badge: "Empresas",
      features: [
        { name: "Todo lo de Pro", included: true },
        { name: "Múltiples ofertas simultáneas", included: true },
        { name: "Dashboard empresarial", included: true },
        { name: "Métricas avanzadas", included: true },
        { name: "Gestión de equipo", included: true },
        { name: "API access", included: true },
        { name: "Soporte dedicado", included: true },
        { name: "Onboarding personalizado", included: true },
        { name: "Reportes personalizados", included: true },
        { name: "Integración con ATS", included: true },
      ],
      cta: "Contactar ventas",
      popular: false,
    },
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    if (planId === "free") {
      // Redirect to signup
      window.location.href = "/auth"
    } else if (planId === "enterprise") {
      // Contact sales
      alert("Te contactaremos pronto para una demo personalizada")
    } else {
      // Start Pro trial
      alert("Iniciando prueba gratuita de 7 días...")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl lg:text-5xl text-balance">
                Planes que se adaptan a <span className="text-accent">tu crecimiento</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Empezá gratis y accedé a funciones premium cuando las necesites. Sin compromisos, cancelá cuando
                quieras.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Mensual</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Anual</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ahorrá 20%
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-2 border-accent shadow-lg scale-105" : "border border-border"
                }`}
              >
                {plan.badge && (
                  <Badge
                    className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                      plan.popular ? "bg-accent" : "bg-primary"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
                      <p className="text-muted-foreground mt-2">{plan.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center space-x-1">
                        <span className="text-4xl font-bold">
                          {formatPrice(isYearly ? plan.price.yearly / 12 : plan.price.monthly)}
                        </span>
                        <span className="text-muted-foreground">/mes</span>
                      </div>
                      {isYearly && plan.price.yearly > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Facturado anualmente ({formatPrice(plan.price.yearly)})
                        </p>
                      )}
                      {plan.id === "pro" && (
                        <p className="text-sm text-accent font-medium">7 días gratis, luego se cobra</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        {feature.included ? (
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? "text-foreground" : "text-muted-foreground line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-accent hover:bg-accent/90"
                        : plan.id === "enterprise"
                          ? "bg-primary hover:bg-primary/90"
                          : ""
                    }`}
                    variant={plan.id === "free" ? "outline" : "default"}
                  >
                    {plan.cta}
                    {plan.id !== "enterprise" && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>

                  {plan.id === "pro" && (
                    <p className="text-xs text-center text-muted-foreground">
                      Renovación automática. Cancelá cuando quieras.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-heading font-bold text-3xl mb-4">Comparación detallada</h2>
              <p className="text-muted-foreground">Todas las funciones de Nova Work en detalle</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-6 font-heading font-semibold">Funcionalidades</th>
                        <th className="text-center p-6 font-heading font-semibold">Free</th>
                        <th className="text-center p-6 font-heading font-semibold bg-accent/5">Pro</th>
                        <th className="text-center p-6 font-heading font-semibold">Empresarial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          feature: "Vistas de ofertas por día",
                          free: "10",
                          pro: "Ilimitadas",
                          enterprise: "Ilimitadas",
                        },
                        { feature: "Contactos por mes", free: "5", pro: "Ilimitados", enterprise: "Ilimitados" },
                        { feature: "Badge verificado", free: "❌", pro: "✅", enterprise: "✅" },
                        { feature: "Prioridad en búsquedas", free: "❌", pro: "✅", enterprise: "✅" },
                        { feature: "Ofertas simultáneas", free: "1", pro: "3", enterprise: "Ilimitadas" },
                        { feature: "Métricas y analytics", free: "Básicas", pro: "Avanzadas", enterprise: "Completas" },
                        { feature: "Soporte", free: "Email", pro: "Prioritario", enterprise: "Dedicado" },
                      ].map((row, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-6 font-medium">{row.feature}</td>
                          <td className="p-6 text-center text-muted-foreground">{row.free}</td>
                          <td className="p-6 text-center bg-accent/5 font-medium">{row.pro}</td>
                          <td className="p-6 text-center font-medium">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl">Prueba sin riesgo</h3>
                  <p className="text-muted-foreground">7 días gratis del plan Pro. Cancelá cuando quieras.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl">Pago seguro</h3>
                  <p className="text-muted-foreground">Procesamiento seguro con encriptación de nivel bancario.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl">Soporte dedicado</h3>
                  <p className="text-muted-foreground">Equipo de soporte listo para ayudarte cuando lo necesites.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="font-heading font-bold text-3xl mb-4">Preguntas frecuentes</h2>
              <p className="text-muted-foreground">Todo lo que necesitás saber sobre nuestros planes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  q: "¿Puedo cancelar mi suscripción en cualquier momento?",
                  a: "Sí, podés cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta. No hay penalidades ni cargos por cancelación.",
                },
                {
                  q: "¿Qué incluye la prueba gratuita de 7 días?",
                  a: "La prueba incluye todas las funciones del plan Pro: contactos ilimitados, badge verificado, prioridad en búsquedas y soporte prioritario.",
                },
                {
                  q: "¿Cómo funciona la facturación anual?",
                  a: "Con la facturación anual ahorrás 20% y se cobra una vez al año. Podés cambiar a facturación mensual en cualquier momento.",
                },
                {
                  q: "¿Qué métodos de pago aceptan?",
                  a: "Aceptamos todas las tarjetas de crédito y débito principales, transferencia bancaria y MercadoPago.",
                },
                {
                  q: "¿El plan empresarial incluye onboarding?",
                  a: "Sí, incluye onboarding personalizado, capacitación del equipo y configuración inicial sin costo adicional.",
                },
                {
                  q: "¿Puedo cambiar de plan después?",
                  a: "Sí, podés actualizar o degradar tu plan en cualquier momento. Los cambios se reflejan inmediatamente en tu cuenta.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-12 text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-6 h-6 text-accent" />
                  <h2 className="font-heading font-bold text-3xl">¿Listo para empezar?</h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Únete a miles de profesionales que ya están conectando con oportunidades laborales cerca de casa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="flex-1" onClick={() => handleSelectPlan("pro")}>
                  Probar Pro gratis
                  <Crown className="ml-2 w-4 h-4" />
                </Button>
                <Link href="/auth">
                  <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                    Empezar gratis
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                Sin tarjeta de crédito requerida para el plan gratuito • Cancelá cuando quieras
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

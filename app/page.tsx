import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { MapPin, Shield, Zap, CheckCircle, Star, ArrowRight, Search, MessageCircle, Verified } from "lucide-react"
import Link from "next/link"

const Footer = dynamic(() => import("@/components/footer").then((mod) => mod.Footer), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
})

const AIAssistant = dynamic(() => import("@/components/ai-assistant").then((mod) => mod.AIAssistant), {
  ssr: false,
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-balance">
                Trabajo real, <span className="text-accent">cerca tuyo</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Buscá y ofrecé empleo en tu localidad. Perfiles verificados, mapa de cercanía y conexión directa con
                empleadores reales.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Explorar empleos
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Gratis para empezar</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-accent" />
                <span>Perfiles verificados</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Búsqueda local</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Cómo funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conectate con oportunidades laborales en 3 simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-xl">1. Activá tu ubicación</h3>
                  <p className="text-muted-foreground">
                    Permitinos conocer tu zona para mostrarte las mejores oportunidades cerca de vos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-xl">2. Explorá empleos cercanos</h3>
                  <p className="text-muted-foreground">
                    Descubrí ofertas laborales a menos de 5 km de tu ubicación, filtradas por categoría y modalidad.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-xl">3. Contactá con verificados</h3>
                  <p className="text-muted-foreground">
                    Conectate directamente con empleadores y candidatos verificados para mayor confianza.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-3xl lg:text-4xl">¿Por qué elegir Nova Work?</h2>
                <p className="text-lg text-muted-foreground">
                  La primera plataforma que combina red social profesional con búsqueda de empleo local.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-lg">100% Local</h3>
                    <p className="text-muted-foreground">
                      Encontrá trabajo cerca de casa. Sin viajes largos, más tiempo para vos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-lg">Perfiles Verificados</h3>
                    <p className="text-muted-foreground">
                      Todos los usuarios pasan por un proceso de verificación para mayor seguridad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-lg">Conexión Rápida</h3>
                    <p className="text-muted-foreground">
                      Contacto directo con empleadores. Sin intermediarios, sin demoras.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8">
                <img
                  src="/professional-networking-app-interface-showing-job-.jpg"
                  alt="Nova Work app interface"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Casos de éxito</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Miles de personas ya encontraron trabajo cerca de casa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Encontré trabajo de carpintero a 2 cuadras de casa. El proceso de verificación me dio mucha
                  confianza."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-accent">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Miguel R.</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-muted-foreground">Carpintero</p>
                      <Verified className="w-3 h-3 text-accent" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Como dueña de restaurante, pude encontrar personal de cocina verificado en mi barrio rápidamente."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-accent">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ana L.</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-muted-foreground">Restaurante</p>
                      <Verified className="w-3 h-3 text-accent" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Trabajo freelance en diseño y ahora tengo clientes locales fijos. La app cambió mi forma de
                  trabajar."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-accent">C</span>
                  </div>
                  <div>
                    <p className="font-semibold">Carla M.</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-muted-foreground">Diseñadora</p>
                      <Verified className="w-3 h-3 text-accent" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Planes que se adaptan a vos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empezá gratis y accedé a funciones premium cuando las necesites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2 border-border">
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl">Free</h3>
                  <p className="text-muted-foreground">Para empezar a explorar</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">10 vistas por día</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">5 contactos por mes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Búsqueda básica</span>
                  </li>
                </ul>
                <Link href="/auth" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Empezar gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-2 border-accent relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent">Más popular</Badge>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl">Pro</h3>
                  <p className="text-muted-foreground">Para profesionales activos</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">$2.990</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="text-sm text-accent">7 días gratis</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Vistas ilimitadas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Contactos ilimitados</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Badge verificado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Prioridad en búsquedas</span>
                  </li>
                </ul>
                <Link href="/pricing" className="block">
                  <Button className="w-full">Probar 7 días gratis</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 border-2 border-border">
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl">Empresarial</h3>
                  <p className="text-muted-foreground">Para reclutadores</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">$9.990</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Múltiples ofertas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Dashboard avanzado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Métricas detalladas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Soporte prioritario</span>
                  </li>
                </ul>
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Contactar ventas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">¿Listo para encontrar trabajo cerca tuyo?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Únete a miles de personas que ya están conectando con oportunidades laborales en su zona.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Crear cuenta gratis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Ver empleos disponibles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  )
}

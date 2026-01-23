import { HeroBlobs } from "@/components/landing-blobs"
import { BenefitsBlobs } from "@/components/landing-blobs-benefits"
import { TestimonialCard } from "@/components/landing-testimonial-card"
const Footer = dynamic(() => import("@/components/footer").then((mod) => mod.Footer), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />, 
})
const AIAssistant = dynamic(() => import("@/components/ai-assistant").then((mod) => mod.AIAssistant), {
  ssr: false,
})

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      {/* Hero Section - fondo animado, glass, animaciones */}
      <section className="relative py-24 lg:py-40 overflow-hidden flex items-center justify-center min-h-[70vh]">
        <HeroBlobs />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-10">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-[#0b1f17]/70 rounded-3xl shadow-2xl border border-accent/10 p-10 md:p-16 animate-fade-in-up">
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl text-balance tracking-tight mb-4">
              Trabajo real, <span className="text-accent bg-accent/10 px-2 py-1 rounded-xl shadow-accent/10 animate-pulse">cerca tuyo</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
              Buscá y ofrecé empleo en tu localidad. <span className="text-accent font-semibold">Perfiles verificados</span>, mapa de cercanía y conexión directa con empleadores reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 animate-fade-in">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:scale-105 transition-transform duration-200">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent hover:bg-accent/10 hover:text-accent border-accent/30">
                  Explorar empleos
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-4 animate-fade-in">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Gratis para empezar</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-accent" />
                <span>Perfiles verificados</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Búsqueda local</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - cards animadas, líneas conectando */}
      <section className="py-24 bg-muted/40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,160 C480,320 960,0 1440,160" stroke="#0fa36b22" strokeWidth="8" fill="none" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-4xl lg:text-5xl animate-fade-in-up">¿Cómo funciona?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">Conectate con oportunidades laborales en 3 simples pasos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="text-center p-10 border-0 shadow-xl bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl transition-transform hover:scale-105 hover:shadow-2xl duration-300 animate-fade-in-up">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                  <MapPin className="w-10 h-10 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-2xl">1. Activá tu ubicación</h3>
                  <p className="text-muted-foreground">Permitinos conocer tu zona para mostrarte las mejores oportunidades cerca de vos.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center p-10 border-0 shadow-xl bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl transition-transform hover:scale-105 hover:shadow-2xl duration-300 animate-fade-in-up delay-100">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                  <Search className="w-10 h-10 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-2xl">2. Explorá empleos cercanos</h3>
                  <p className="text-muted-foreground">Descubrí ofertas laborales a menos de 5 km de tu ubicación, filtradas por categoría y modalidad.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center p-10 border-0 shadow-xl bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl transition-transform hover:scale-105 hover:shadow-2xl duration-300 animate-fade-in-up delay-200">
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                  <MessageCircle className="w-10 h-10 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-2xl">3. Contactá con verificados</h3>
                  <p className="text-muted-foreground">Conectate directamente con empleadores y candidatos verificados para mayor confianza.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits - fondo animado, iconos animados, glass */}
      <section className="py-24 relative overflow-hidden">
        <BenefitsBlobs />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in-up">
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-4xl lg:text-5xl">¿Por qué elegir Nova Work?</h2>
                <p className="text-xl text-muted-foreground">La primera plataforma que combina red social profesional con búsqueda de empleo local.</p>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                    <MapPin className="w-7 h-7 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-xl">100% Local</h3>
                    <p className="text-muted-foreground">Encontrá trabajo cerca de casa. Sin viajes largos, más tiempo para vos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce-slow delay-100">
                    <Shield className="w-7 h-7 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-xl">Perfiles Verificados</h3>
                    <p className="text-muted-foreground">Todos los usuarios pasan por un proceso de verificación para mayor seguridad.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce-slow delay-200">
                    <Zap className="w-7 h-7 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-xl">Conexión Rápida</h3>
                    <p className="text-muted-foreground">Contacto directo con empleadores. Sin intermediarios, sin demoras.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-up delay-200">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-8 shadow-2xl border border-accent/10">
                <img
                  src="/professional-networking-app-interface-showing-job-.jpg"
                  alt="Nova Work app interface"
                  className="w-full h-auto rounded-lg shadow-lg border border-accent/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios - cards flotantes, glass, animaciones */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-4xl lg:text-5xl animate-fade-in-up">Casos de éxito</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">Miles de personas ya encontraron trabajo cerca de casa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TestimonialCard
              name="Miguel R."
              role="Carpintero"
              text="Encontré trabajo de carpintero a 2 cuadras de casa. El proceso de verificación me dio mucha confianza."
              color="#0fa36b"
              avatar="M"
            />
            <TestimonialCard
              name="Ana L."
              role="Restaurante"
              text="Como dueña de restaurante, pude encontrar personal de cocina verificado en mi barrio rápidamente."
              color="#0fa36b"
              avatar="A"
            />
            <TestimonialCard
              name="Carla M."
              role="Diseñadora"
              text="Trabajo freelance en diseño y ahora tengo clientes locales fijos. La app cambió mi forma de trabajar."
              color="#0fa36b"
              avatar="C"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview - glass, badges animados, resalte dinámico */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-4xl lg:text-5xl animate-fade-in-up">Planes que se adaptan a vos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">Empezá gratis y accedé a funciones premium cuando las necesites</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-10 border-0 shadow-xl bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl animate-fade-in-up">
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
                  <Button variant="outline" className="w-full bg-transparent hover:bg-accent/10 hover:text-accent border-accent/30">Empezar gratis</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Pro Plan */}
            <Card className="p-10 border-2 border-accent relative shadow-2xl bg-white/90 dark:bg-[#0fa36b]/10 backdrop-blur-xl scale-105 animate-fade-in-up">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white font-bold text-xs shadow-lg animate-bounce-slow">Más popular</span>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl text-accent">Pro</h3>
                  <p className="text-muted-foreground">Para profesionales activos</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-accent">$2.990</span>
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
                  <Button className="w-full bg-accent text-white hover:scale-105 transition-transform duration-200">Probar 7 días gratis</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Enterprise Plan */}
            <Card className="p-10 border-0 shadow-xl bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl animate-fade-in-up">
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
                  <Button variant="outline" className="w-full bg-transparent hover:bg-accent/10 hover:text-accent border-accent/30">Contactar ventas</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - fondo degradado, glass, animación */}
      <section className="py-24 bg-gradient-to-br from-accent/90 to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60%" cy="40%" rx="320" ry="120" fill="#fff2" />
            <ellipse cx="20%" cy="80%" rx="180" ry="60" fill="#0fa36b22" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 animate-fade-in-up">
          <div className="backdrop-blur-xl bg-white/80 dark:bg-[#0b1f17]/80 rounded-3xl shadow-2xl border border-accent/10 p-10 md:p-16 mx-auto">
            <h2 className="font-heading font-bold text-4xl lg:text-5xl mb-4">¿Listo para encontrar trabajo cerca tuyo?</h2>
            <p className="text-2xl opacity-90 max-w-2xl mx-auto mb-8">Únete a miles de personas que ya están conectando con oportunidades laborales en su zona.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg hover:scale-105 transition-transform duration-200">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10 hover:text-accent bg-transparent"
                >
                  Ver empleos disponibles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  )
}

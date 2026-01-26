import dynamic from "next/dynamic";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/components/landing-testimonial-card";

const Footer = dynamic(() =>
  import("@/components/footer").then((mod) => mod.Footer)
);
const AIAssistant = dynamic(
  () => import("@/components/ai-assistant").then((mod) => mod.AIAssistant),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* TESTIMONIOS */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Casos de éxito</h2>
            <p className="text-muted-foreground mt-4">
              Miles de personas ya encontraron trabajo cerca de casa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TestimonialCard
              name="Miguel R."
              role="Carpintero"
              text="Encontré trabajo de carpintero a 2 cuadras de casa."
              color="#0fa36b"
              avatar="M"
            />
            <TestimonialCard
              name="Ana L."
              role="Restaurante"
              text="Encontré personal verificado en mi barrio."
              color="#0fa36b"
              avatar="A"
            />
            <TestimonialCard
              name="Carla M."
              role="Diseñadora"
              text="Ahora tengo clientes locales fijos."
              color="#0fa36b"
              avatar="C"
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Planes</h2>
            <p className="text-muted-foreground mt-4">
              Empezá gratis y escalá cuando lo necesites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="p-8">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold">Free</h3>
                <p>$0 / mes</p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" /> 10 vistas por día
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-accent">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold text-accent">Pro</h3>
                <p>$2.990 / mes</p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" /> Vistas ilimitadas
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">
                    Probar 7 días
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold">Empresarial</h3>
                <p>$9.990 / mes</p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Contactar ventas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          ¿Listo para encontrar trabajo cerca tuyo?
        </h2>
        <Link href="/auth">
          <Button size="lg" variant="secondary">
            Crear cuenta gratis
          </Button>
        </Link>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  );
}

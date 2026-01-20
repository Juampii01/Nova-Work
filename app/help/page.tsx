"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  Users,
  Briefcase,
  Video,
} from "lucide-react"

export default function HelpPage() {
  const categories = [
    { icon: Briefcase, title: "Trabajos y Postulaciones", count: 12 },
    { icon: Users, title: "Perfil y Cuenta", count: 8 },
    { icon: CreditCard, title: "Pagos y Suscripciones", count: 6 },
    { icon: Shield, title: "Seguridad y Privacidad", count: 10 },
    { icon: MessageCircle, title: "Mensajería y Networking", count: 7 },
    { icon: Video, title: "Videollamadas", count: 5 },
  ]

  const faqs = [
    {
      category: "general",
      question: "¿Qué es Nova Work?",
      answer:
        "Nova Work es una plataforma de networking profesional local que conecta talento con oportunidades laborales cercanas. Ofrecemos búsqueda de empleo, networking, marketplace de servicios freelance, y herramientas de desarrollo profesional.",
    },
    {
      category: "general",
      question: "¿Es gratis usar Nova Work?",
      answer:
        "Sí, tenemos un plan gratuito que incluye búsqueda de trabajos, perfil básico, y mensajería limitada. Los planes Premium y Pro ofrecen funcionalidades avanzadas como búsqueda prioritaria, perfil destacado, y analytics completos.",
    },
    {
      category: "trabajos",
      question: "¿Cómo postulo a un trabajo?",
      answer:
        'Navega a la sección de Feed, encuentra el trabajo que te interesa, haz clic en "Ver detalles" y luego en "Postularme". Puedes personalizar tu mensaje de presentación y adjuntar documentos adicionales si es necesario.',
    },
    {
      category: "trabajos",
      question: "¿Puedo publicar trabajos de forma gratuita?",
      answer:
        "El plan gratuito permite 1 publicación activa por mes. Los planes Premium y Pro incluyen publicaciones ilimitadas con mayor visibilidad y herramientas de filtrado de candidatos.",
    },
    {
      category: "perfil",
      question: "¿Cómo verifico mi perfil?",
      answer:
        "Ve a Configuración > Verificación y sube una foto de tu documento de identidad y una selfie. El proceso toma 24-48 horas. Los perfiles verificados reciben un badge azul y mayor visibilidad en búsquedas.",
    },
    {
      category: "perfil",
      question: "¿Puedo ocultar mi perfil mientras busco trabajo?",
      answer:
        'Sí, en Configuración > Privacidad puedes activar el "Modo Privado" que oculta tu perfil de búsquedas públicas pero te permite seguir postulando a trabajos.',
    },
    {
      category: "pagos",
      question: "¿Cómo funciona el sistema de créditos?",
      answer:
        "Los créditos se usan para destacar publicaciones, enviar mensajes prioritarios, y acceder a funciones premium temporales. Puedes comprar paquetes de créditos o recibirlos como parte de tu suscripción.",
    },
    {
      category: "pagos",
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer:
        "Sí, puedes cancelar tu suscripción cuando quieras desde Configuración > Suscripción. Mantendrás el acceso hasta el final del período pagado.",
    },
    {
      category: "seguridad",
      question: "¿Cómo reporto un perfil o contenido inapropiado?",
      answer:
        'Haz clic en los tres puntos en cualquier perfil, publicación o mensaje, y selecciona "Reportar". Nuestro equipo revisa todos los reportes en menos de 24 horas.',
    },
    {
      category: "seguridad",
      question: "¿Mis datos están seguros?",
      answer:
        "Sí, usamos encriptación de nivel bancario, cumplimos con GDPR y LGPD, y nunca vendemos tus datos a terceros. Lee nuestra Política de Privacidad para más detalles.",
    },
    {
      category: "mensajeria",
      question: "¿Puedo hacer videollamadas?",
      answer:
        "Sí, todos los usuarios pueden iniciar videollamadas desde el chat. Las llamadas son peer-to-peer y encriptadas. Los planes Premium incluyen grabación de llamadas y transcripciones.",
    },
    {
      category: "mensajeria",
      question: "¿Hay límite de mensajes?",
      answer:
        "El plan gratuito permite 10 conversaciones nuevas por mes. Los planes pagos incluyen mensajería ilimitada y funciones avanzadas como traducción automática y plantillas.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-4">Centro de Ayuda</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Necesitas ayuda? Busca en nuestra base de conocimientos o contáctanos directamente
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar en la ayuda... Ej: '¿Cómo verifico mi perfil?'" className="pl-10" />
            </div>
            <Button>Buscar</Button>
          </div>
        </Card>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <MessageCircle className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Chat en vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">Respuesta inmediata de lun-vie 9am-6pm</p>
            <Button variant="outline" className="w-full bg-transparent">
              Iniciar chat
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Mail className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">Respuesta en menos de 24 horas</p>
            <Button variant="outline" className="w-full bg-transparent">
              Enviar email
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Phone className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Teléfono</h3>
            <p className="text-sm text-muted-foreground mb-4">+1 (555) 123-4567</p>
            <Button variant="outline" className="w-full bg-transparent">
              Llamar ahora
            </Button>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Categorías populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.title} className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} artículos
                  </Badge>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-6">Preguntas frecuentes</h2>
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold font-heading mb-2">¿Aún necesitas ayuda?</h2>
          <p className="text-muted-foreground mb-6">Nuestro equipo de soporte está listo para ayudarte</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contactar soporte
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Ver documentación
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

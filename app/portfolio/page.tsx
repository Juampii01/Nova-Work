"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  FileText,
  Plus,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Star,
  Briefcase,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  User,
} from "lucide-react"
import Link from "next/link"

interface Portfolio {
  id: string
  name: string
  type: "portfolio" | "cv"
  template: string
  lastModified: Date
  isPublic: boolean
  views: number
  downloads: number
  url: string
}

interface CVData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website?: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate?: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
    honors?: string[]
  }>
  skills: Array<{
    category: string
    items: Array<{ name: string; level: number }>
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
    github?: string
    image?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    url?: string
  }>
  languages: Array<{
    name: string
    level: string
  }>
}

const mockPortfolios: Portfolio[] = [
  {
    id: "1",
    name: "CV Profesional - Desarrollador",
    type: "cv",
    template: "modern",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPublic: true,
    views: 156,
    downloads: 23,
    url: "/portfolio/cv/1",
  },
  {
    id: "2",
    name: "Portfolio Creativo - Diseñador UX",
    type: "portfolio",
    template: "creative",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isPublic: true,
    views: 89,
    downloads: 12,
    url: "/portfolio/portfolio/2",
  },
  {
    id: "3",
    name: "CV Ejecutivo - Marketing",
    type: "cv",
    template: "executive",
    lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isPublic: false,
    views: 34,
    downloads: 8,
    url: "/portfolio/cv/3",
  },
]

const mockCVData: CVData = {
  personalInfo: {
    name: "Juan Carlos Pérez",
    title: "Desarrollador Full Stack Senior",
    email: "juan.perez@email.com",
    phone: "+54 11 1234-5678",
    location: "Buenos Aires, Argentina",
    website: "https://juanperez.dev",
    summary:
      "Desarrollador Full Stack con más de 5 años de experiencia en tecnologías web modernas. Especializado en React, Node.js y arquitecturas cloud. Apasionado por crear soluciones escalables y experiencias de usuario excepcionales.",
  },
  experience: [
    {
      id: "1",
      company: "TechCorp Argentina",
      position: "Senior Full Stack Developer",
      startDate: "2022-03",
      current: true,
      description:
        "Lidero el desarrollo de aplicaciones web escalables utilizando React, Node.js y AWS. Responsable de la arquitectura técnica y mentoring del equipo junior.",
      achievements: [
        "Reduje el tiempo de carga de la aplicación principal en un 40%",
        "Implementé CI/CD que redujo los deployments de 2 horas a 15 minutos",
        "Lideré la migración a microservicios, mejorando la escalabilidad",
      ],
    },
    {
      id: "2",
      company: "StartupBA",
      position: "Full Stack Developer",
      startDate: "2020-01",
      endDate: "2022-02",
      current: false,
      description:
        "Desarrollé desde cero la plataforma principal de la startup utilizando MERN stack. Colaboré directamente con el equipo de producto y diseño.",
      achievements: [
        "Desarrollé MVP que atrajo 10,000+ usuarios en 6 meses",
        "Implementé sistema de pagos con Stripe y MercadoPago",
        "Optimicé base de datos reduciendo consultas en 60%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Universidad de Buenos Aires",
      degree: "Licenciatura",
      field: "Ciencias de la Computación",
      startDate: "2016",
      endDate: "2020",
      gpa: "8.5/10",
      honors: ["Mejor promedio de la promoción", "Beca de excelencia académica"],
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React", level: 9 },
        { name: "TypeScript", level: 8 },
        { name: "Next.js", level: 8 },
        { name: "Tailwind CSS", level: 9 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 9 },
        { name: "Express", level: 8 },
        { name: "PostgreSQL", level: 7 },
        { name: "MongoDB", level: 7 },
      ],
    },
    {
      category: "DevOps",
      items: [
        { name: "AWS", level: 7 },
        { name: "Docker", level: 8 },
        { name: "CI/CD", level: 7 },
        { name: "Kubernetes", level: 6 },
      ],
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Plataforma de e-commerce completa con panel de administración, sistema de pagos y analytics.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      url: "https://ecommerce-demo.com",
      github: "https://github.com/juanperez/ecommerce",
      image: "/placeholder.svg?height=200&width=300&text=E-commerce",
    },
    {
      id: "2",
      name: "Task Management App",
      description: "Aplicación de gestión de tareas con colaboración en tiempo real y notificaciones push.",
      technologies: ["Next.js", "Socket.io", "MongoDB", "PWA"],
      url: "https://taskapp-demo.com",
      github: "https://github.com/juanperez/taskapp",
      image: "/placeholder.svg?height=200&width=300&text=Task+App",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06",
      url: "https://aws.amazon.com/certification/",
    },
    {
      id: "2",
      name: "React Advanced Patterns",
      issuer: "Frontend Masters",
      date: "2023-03",
    },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
    { name: "Portugués", level: "Intermedio" },
  ],
}

const templates = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y profesional",
    preview: "/placeholder.svg?height=300&width=200&text=Modern",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Para profesionales creativos",
    preview: "/placeholder.svg?height=300&width=200&text=Creative",
  },
  {
    id: "executive",
    name: "Ejecutivo",
    description: "Formal y elegante",
    preview: "/placeholder.svg?height=300&width=200&text=Executive",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Simple y efectivo",
    preview: "/placeholder.svg?height=300&width=200&text=Minimal",
  },
]

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios)
  const [activeTab, setActiveTab] = useState("my-portfolios")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const handleDeletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    setPortfolios((prev) => prev.map((p) => (p.id === id ? { ...p, isPublic: !p.isPublic } : p)))
  }

  const getSkillLevel = (level: number) => {
    if (level >= 8) return "Experto"
    if (level >= 6) return "Avanzado"
    if (level >= 4) return "Intermedio"
    return "Básico"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Portfolio y CV Builder</h1>
          <p className="text-muted-foreground mt-2">Crea y gestiona tus portfolios y CVs profesionales</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-portfolios">Mis Portfolios</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="cv-builder">Constructor CV</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          {/* My Portfolios Tab */}
          <TabsContent value="my-portfolios" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mis Portfolios ({portfolios.length})</h2>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/portfolio/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-nova-accent" />
                        <Badge variant={portfolio.type === "cv" ? "default" : "secondary"}>
                          {portfolio.type === "cv" ? "CV" : "Portfolio"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/portfolio/edit/${portfolio.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePortfolio(portfolio.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{portfolio.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Vista previa</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Plantilla:</span>
                        <span className="capitalize">{portfolio.template}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Modificado:</span>
                        <span>{formatDate(portfolio.lastModified)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Visibilidad:</span>
                        <Badge variant={portfolio.isPublic ? "default" : "secondary"}>
                          {portfolio.isPublic ? "Público" : "Privado"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{portfolio.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{portfolio.downloads}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={portfolio.url}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create New Card */}
              <Card className="border-dashed border-2 hover:border-nova-accent transition-colors cursor-pointer">
                <Link href="/portfolio/create" className="block h-full">
                  <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Crear Nuevo</h3>
                    <p className="text-sm text-muted-foreground">Comienza con una plantilla profesional</p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Plantillas Disponibles</h2>
              <p className="text-muted-foreground mb-6">
                Elige una plantilla profesional para comenzar tu portfolio o CV
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? "ring-2 ring-nova-accent" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <Button
                      size="sm"
                      className="w-full"
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                    >
                      {selectedTemplate === template.id ? "Seleccionado" : "Usar Plantilla"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTemplate && (
              <div className="flex justify-center pt-6">
                <Button size="lg" asChild>
                  <Link href={`/portfolio/create?template=${selectedTemplate}`}>
                    Continuar con {templates.find((t) => t.id === selectedTemplate)?.name}
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* CV Builder Tab */}
          <TabsContent value="cv-builder" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Constructor de CV</h2>
              <p className="text-muted-foreground mb-6">Completa tu información profesional paso a paso</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nombre completo</label>
                        <input
                          type="text"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          defaultValue={mockCVData.personalInfo.name}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Título profesional</label>
                        <input
                          type="text"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          defaultValue={mockCVData.personalInfo.title}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          defaultValue={mockCVData.personalInfo.email}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Teléfono</label>
                        <input
                          type="tel"
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          defaultValue={mockCVData.personalInfo.phone}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Resumen profesional</label>
                      <textarea
                        className="w-full mt-1 px-3 py-2 border rounded-md min-h-24"
                        defaultValue={mockCVData.personalInfo.summary}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Experiencia Laboral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockCVData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{exp.position}</h4>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                        </p>
                        <p className="text-sm mb-3">{exp.description}</p>
                        <div className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-nova-accent mt-1">•</span>
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Experiencia
                    </Button>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Habilidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockCVData.skills.map((skillCategory, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-3">{skillCategory.category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {skillCategory.items.map((skill, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-sm">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-nova-accent rounded-full"
                                    style={{ width: `${(skill.level / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-16">{getSkillLevel(skill.level)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Categoría
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Vista Previa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Vista previa del CV</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Vista Completa
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Vista Previa - CV Profesional</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>

            {/* CV Preview */}
            <Card>
              <CardContent className="p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Header */}
                  <div className="text-center border-b pb-6">
                    <h1 className="text-3xl font-bold mb-2">{mockCVData.personalInfo.name}</h1>
                    <p className="text-xl text-nova-accent mb-4">{mockCVData.personalInfo.title}</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {mockCVData.personalInfo.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {mockCVData.personalInfo.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockCVData.personalInfo.location}
                      </div>
                      {mockCVData.personalInfo.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={mockCVData.personalInfo.website} className="hover:underline">
                            {mockCVData.personalInfo.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-nova-accent">Resumen Profesional</h2>
                    <p className="text-muted-foreground leading-relaxed">{mockCVData.personalInfo.summary}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-nova-accent">Experiencia Laboral</h2>
                    <div className="space-y-6">
                      {mockCVData.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{exp.position}</h3>
                              <p className="text-muted-foreground">{exp.company}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                            </p>
                          </div>
                          <p className="text-sm mb-3">{exp.description}</p>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-nova-accent mt-1">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-nova-accent">Habilidades Técnicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mockCVData.skills.map((skillCategory, index) => (
                        <div key={index}>
                          <h3 className="font-semibold mb-3">{skillCategory.category}</h3>
                          <div className="space-y-2">
                            {skillCategory.items.map((skill, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="text-sm">{skill.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-nova-accent rounded-full"
                                      style={{ width: `${(skill.level / 10) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-nova-accent">Proyectos Destacados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockCVData.projects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {project.url && (
                              <a
                                href={project.url}
                                className="text-xs text-nova-accent hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Demo
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                className="text-xs text-nova-accent hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Certifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-nova-accent">Educación</h2>
                      {mockCVData.education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                          <h3 className="font-semibold">
                            {edu.degree} en {edu.field}
                          </h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.gpa && <p className="text-sm">Promedio: {edu.gpa}</p>}
                          {edu.honors && (
                            <ul className="text-sm mt-1">
                              {edu.honors.map((honor, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-nova-accent">•</span>
                                  <span>{honor}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-nova-accent">Certificaciones</h2>
                      {mockCVData.certifications.map((cert) => (
                        <div key={cert.id} className="mb-4">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                          <p className="text-sm text-muted-foreground">{cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

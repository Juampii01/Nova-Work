"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, Upload, X, Plus, DollarSign, Clock, Star, Award } from "lucide-react"
import Link from "next/link"

interface ServiceForm {
  title: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  priceType: "fixed" | "hourly" | "project"
  price: string
  deliveryTime: string
  images: string[]
  packages: {
    basic: { name: string; description: string; price: string; deliveryTime: string; features: string[] }
    standard: { name: string; description: string; price: string; deliveryTime: string; features: string[] }
    premium: { name: string; description: string; price: string; deliveryTime: string; features: string[] }
  }
}

const categories = {
  "Diseño Gráfico": ["Logos e Identidad", "Diseño Web", "Ilustración", "Packaging"],
  Programación: ["Desarrollo Web", "Aplicaciones Móviles", "WordPress", "E-commerce"],
  Marketing: ["Marketing Digital", "SEO", "Redes Sociales", "Copywriting"],
  Redacción: ["Artículos", "Traducción", "Corrección", "Contenido Web"],
  Fotografía: ["Productos", "Eventos", "Retratos", "Inmobiliaria"],
  Video: ["Edición", "Animación", "Promocionales", "Tutoriales"],
}

export default function SellServicePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<ServiceForm>({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    tags: [],
    priceType: "fixed",
    price: "",
    deliveryTime: "",
    images: [],
    packages: {
      basic: { name: "Básico", description: "", price: "", deliveryTime: "", features: [""] },
      standard: { name: "Estándar", description: "", price: "", deliveryTime: "", features: [""] },
      premium: { name: "Premium", description: "", price: "", deliveryTime: "", features: [""] },
    },
  })
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim()) && form.tags.length < 5) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const addFeature = (packageType: keyof typeof form.packages) => {
    setForm((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: [...prev.packages[packageType].features, ""],
        },
      },
    }))
  }

  const updateFeature = (packageType: keyof typeof form.packages, index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: prev.packages[packageType].features.map((feature, i) => (i === index ? value : feature)),
        },
      },
    }))
  }

  const removeFeature = (packageType: keyof typeof form.packages, index: number) => {
    setForm((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          features: prev.packages[packageType].features.filter((_, i) => i !== index),
        },
      },
    }))
  }

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    alert("¡Servicio publicado exitosamente!")
  }

  const steps = [
    { number: 1, title: "Información Básica", description: "Título, descripción y categoría" },
    { number: 2, title: "Precios y Entrega", description: "Estructura de precios y tiempos" },
    { number: 3, title: "Galería", description: "Imágenes y portfolio" },
    { number: 4, title: "Paquetes", description: "Opciones de servicio" },
    { number: 5, title: "Revisión", description: "Confirmar y publicar" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al marketplace
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">Crear Nuevo Servicio</h1>
          <p className="text-muted-foreground mt-2">Comparte tus habilidades y genera ingresos</p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step.number ? "bg-nova-accent text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-nova-accent" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Título del servicio *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Diseño de logo profesional para tu empresa"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.title.length}/80 caracteres</p>
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente qué incluye tu servicio..."
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-32"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.description.length}/1200 caracteres</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Categoría *</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, category: value, subcategory: "" }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(categories).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subcategoría *</Label>
                    <Select
                      value={form.subcategory}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, subcategory: value }))}
                      disabled={!form.category}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona una subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {form.category &&
                          categories[form.category as keyof typeof categories]?.map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Etiquetas (máximo 5)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Agregar etiqueta"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} disabled={form.tags.length >= 5}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing and Delivery */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Tipo de precio *</Label>
                  <Select
                    value={form.priceType}
                    onValueChange={(value: any) => setForm((prev) => ({ ...prev, priceType: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Precio fijo</SelectItem>
                      <SelectItem value="hourly">Por hora</SelectItem>
                      <SelectItem value="project">Por proyecto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">
                      Precio {form.priceType === "hourly" ? "por hora" : form.priceType === "project" ? "desde" : ""} *
                    </Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={form.price}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryTime">Tiempo de entrega *</Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Select
                        value={form.deliveryTime}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, deliveryTime: value }))}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Selecciona tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 día">1 día</SelectItem>
                          <SelectItem value="2 días">2 días</SelectItem>
                          <SelectItem value="3 días">3 días</SelectItem>
                          <SelectItem value="1 semana">1 semana</SelectItem>
                          <SelectItem value="2 semanas">2 semanas</SelectItem>
                          <SelectItem value="1 mes">1 mes</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Consejos para precios competitivos</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Investiga precios similares en el marketplace</li>
                          <li>• Considera tu experiencia y calidad de trabajo</li>
                          <li>• Ofrece diferentes opciones de paquetes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Gallery */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Imágenes del servicio *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sube hasta 5 imágenes que muestren tu trabajo. La primera será la imagen principal.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="aspect-video border-2 border-dashed border-muted rounded-lg flex items-center justify-center hover:border-nova-accent transition-colors cursor-pointer"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {index === 0 ? "Imagen principal" : `Imagen ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-nova-accent mt-0.5" />
                      <div>
                        <h4 className="font-medium">Mejores prácticas para imágenes</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Usa imágenes de alta calidad (mínimo 1280x720px)</li>
                          <li>• Muestra ejemplos reales de tu trabajo</li>
                          <li>• Incluye antes y después si es relevante</li>
                          <li>• Evita texto excesivo en las imágenes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>

              {currentStep < 5 ? (
                <Button onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}>Siguiente</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-nova-accent hover:bg-nova-accent/90">
                  Publicar Servicio
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LocationInput, LocationData } from "@/components/location-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MapPin, Briefcase, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createJob } from "@/lib/supabase/database"
import { createClient } from "@/lib/supabase/client"

export default function PostJobPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    category: "",
    modality: "",
    type: "",
    salary: "",
    location: {
      city: "",
      region: "",
      country: "",
      lat: null,
      lng: null,
      raw: "",
    } as LocationData,
    includesSalary: false,
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean | LocationData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para publicar empleos",
          variant: "destructive",
        })
        router.push("/auth")
        return
      }

      // Parse salary_min and salary_max if includesSalary is true and salary is provided
      let salary_min: number | undefined = undefined
      let salary_max: number | undefined = undefined
      if (formData.includesSalary && formData.salary) {
        // Try to extract two numbers from the salary string (e.g., "$150.000 - $200.000")
        const match = formData.salary
          .replace(/\./g, "")
          .match(/(\d+)[^\d]+(\d+)/)
        if (match) {
          salary_min = parseInt(match[1], 10)
          salary_max = parseInt(match[2], 10)
        } else {
          // If only one number, set both min and max to it
          const singleMatch = formData.salary.replace(/\./g, "").match(/(\d+)/)
          if (singleMatch) {
            salary_min = parseInt(singleMatch[1], 10)
            salary_max = parseInt(singleMatch[1], 10)
          }
        }
      }
      await createJob({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
        category: formData.category,
        modality: formData.modality as any,
        job_type: formData.type as any,
        location_text: formData.location.raw,
        city: formData.location.city,
        region: formData.location.region,
        country: formData.location.country,
        lat: formData.location.lat,
        lng: formData.location.lng,
        show_salary: formData.includesSalary,
        ...(formData.includesSalary && {
          salary_min,
          salary_max,
        }),
      })

      toast({
        title: "¡Oferta publicada!",
        description: "Tu oferta de trabajo está online y visible para candidatos cercanos.",
      })

      router.push("/feed")
    } catch (error) {
      console.error("[v0] Error creating job:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al publicar tu oferta. Intentá de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.category && formData.modality && formData.type

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-heading font-bold text-3xl lg:text-4xl">Publicar oferta de trabajo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conectate con candidatos verificados en tu zona. Completá los datos y tu oferta estará online en minutos.
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Detalles de la oferta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título del puesto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="ej. Desarrollador Frontend, Carpintero, Chef de cocina"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Sé específico para atraer a los candidatos correctos</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción del trabajo <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describí las responsabilidades, el ambiente de trabajo y lo que buscás en un candidato..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.description.length}/500 caracteres recomendados
                  </p>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos y habilidades</Label>
                  <Textarea
                    id="requirements"
                    placeholder="ej. Experiencia mínima 2 años, conocimiento en React, disponibilidad horaria..."
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                  />
                </div>

                {/* Category, Modality, Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tecnología</SelectItem>
                        <SelectItem value="oficios">Oficios</SelectItem>
                        <SelectItem value="ventas">Ventas</SelectItem>
                        <SelectItem value="gastronomia">Gastronomía</SelectItem>
                        <SelectItem value="salud">Salud</SelectItem>
                        <SelectItem value="logistica">Logística</SelectItem>
                        <SelectItem value="educacion">Educación</SelectItem>
                        <SelectItem value="admin">Administración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Modalidad <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.modality} onValueChange={(value) => handleInputChange("modality", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                        <SelectItem value="híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Tipo de contrato <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiempo_completo">Full-time</SelectItem>
                        <SelectItem value="medio_tiempo">Part-time</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="por_proyecto">Por proyecto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includesSalary"
                      checked={formData.includesSalary}
                      onCheckedChange={(checked) => handleInputChange("includesSalary", checked as boolean)}
                    />
                    <Label htmlFor="includesSalary" className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Incluir rango salarial (recomendado)</span>
                    </Label>
                  </div>

                  {formData.includesSalary && (
                    <div className="space-y-2">
                      <Label htmlFor="salary">Rango salarial</Label>
                      <Input
                        id="salary"
                        placeholder="ej. $150.000 - $200.000, A convenir, Según experiencia"
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Las ofertas con salario reciben 3x más postulaciones
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <LocationInput
                  value={formData.location}
                  onChange={(value) => handleInputChange("location", value)}
                />
                <p className="text-sm text-muted-foreground">
                  Usamos tu ubicación para mostrar la oferta a candidatos cercanos
                </p>

                {/* Preview Card */}
                <div className="border-t pt-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Vista previa</h3>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-heading font-semibold">{formData.title || "Título del puesto"}</h4>
                          <p className="text-sm text-muted-foreground">Tu empresa</p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {formData.description || "Descripción del trabajo aparecerá aquí..."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.category && (
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              {formData.category}
                            </span>
                          )}
                          {formData.modality && (
                            <span className="px-2 py-1 border rounded text-xs">{formData.modality}</span>
                          )}
                          {formData.type && <span className="px-2 py-1 border rounded text-xs">{formData.type}</span>}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>📍 {formData.location || "Ubicación"}</span>
                            <span>🕒 hace unos minutos</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button type="submit" className="flex-1" disabled={!isFormValid || isLoading}>
                    {isLoading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Publicando oferta...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Publicar oferta
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 bg-transparent">
                    Guardar borrador
                  </Button>
                </div>

                {!isFormValid && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>Completá los campos obligatorios para publicar tu oferta</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Tips para una oferta exitosa</span>
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Usá un título claro y específico que describa exactamente el puesto</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Incluí el rango salarial para recibir más postulaciones calificadas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Describí el ambiente de trabajo y los beneficios que ofrecés</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Sé específico con los requisitos para atraer candidatos adecuados</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

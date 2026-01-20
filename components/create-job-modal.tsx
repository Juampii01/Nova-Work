"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface CreateJobModalProps {
  onJobCreated?: () => void
}

export function CreateJobModal({ onJobCreated }: CreateJobModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, profile } = useAuth()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salary_min: "",
    salary_max: "",
    location: "",
    modality: "hybrid",
    job_type: "full_time",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !profile) {
      toast.error("Debes estar autenticado")
      return
    }

    if (!formData.title || !formData.description) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Crear el job
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements,
            benefits: formData.benefits,
            salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
            salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
            location: formData.location,
            modality: formData.modality,
            job_type: formData.job_type,
            company_id: user.id, // Use user ID as company_id for now
            posted_by: user.id,
            status: "active",
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (jobError) {
        console.error("Error creating job:", jobError)
        toast.error(`Error: ${jobError.message}`)
        return
      }

      toast.success("¡Job creado exitosamente!")
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        benefits: "",
        salary_min: "",
        salary_max: "",
        location: "",
        modality: "hybrid",
        job_type: "full_time",
      })

      setOpen(false)
      onJobCreated?.()
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg">
          <Plus className="w-4 h-4" />
          Crear Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Oferta de Trabajo</DialogTitle>
          <DialogDescription>Completa los detalles del job que quieres publicar</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Título del Job *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="ej: Senior React Developer"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Descripción *
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe el rol, responsabilidades, etc..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="font-semibold">
              Requisitos
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="ej: 3+ años de experiencia, TypeScript, Next.js"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Beneficios */}
          <div className="space-y-2">
            <Label htmlFor="benefits" className="font-semibold">
              Beneficios
            </Label>
            <Textarea
              id="benefits"
              name="benefits"
              placeholder="ej: Seguro médico, Home office, Bonos"
              value={formData.benefits}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Salario */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min" className="font-semibold">
                Salario Mínimo
              </Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                placeholder="ej: 50000"
                value={formData.salary_min}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max" className="font-semibold">
                Salario Máximo
              </Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                placeholder="ej: 80000"
                value={formData.salary_max}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location" className="font-semibold">
              Ubicación
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="ej: Buenos Aires, Argentina"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Modalidad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Modalidad</Label>
              <Select value={formData.modality} onValueChange={(value) => handleSelectChange("modality", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remoto</SelectItem>
                  <SelectItem value="on_site">En Sitio</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Trabajo */}
            <div className="space-y-2">
              <Label className="font-semibold">Tipo de Trabajo</Label>
              <Select value={formData.job_type} onValueChange={(value) => handleSelectChange("job_type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Tiempo Completo</SelectItem>
                  <SelectItem value="part_time">Medio Tiempo</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-accent to-accent/90"
            >
              {isLoading ? "Creando..." : "Crear Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

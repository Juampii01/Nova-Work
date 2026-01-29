"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getJob, updateJob } from "@/lib/supabase/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Switch } from "@/components/ui/switch"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id as string
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      const jobData = await getJob(jobId)
      if (!jobData) {
        setError("No se encontró la propuesta laboral.")
      } else {
        setJob(jobData)
      }
      setLoading(false)
    }
    fetchJob()
  }, [jobId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateJob(jobId, {
        title: job.title,
        description: job.description,
        // Agrega aquí más campos si los editas
      })
      router.push(`/job/${jobId}`)
    } catch (err) {
      setError("Error al guardar cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleArrayChange = (field: "benefits" | "requirements", value: string, idx: number) => {
    const arr = Array.isArray(job[field]) ? [...job[field]] : [];
    arr[idx] = value;
    setJob({ ...job, [field]: arr });
  };
  const handleAddArrayItem = (field: "benefits" | "requirements") => {
    const arr = Array.isArray(job[field]) ? [...job[field]] : [];
    arr.push("");
    setJob({ ...job, [field]: arr });
  };
  const handleRemoveArrayItem = (field: "benefits" | "requirements", idx: number) => {
    const arr = Array.isArray(job[field]) ? [...job[field]] : [];
    arr.splice(idx, 1);
    setJob({ ...job, [field]: arr });
  };

  if (loading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!job) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Editar propuesta laboral</h1>
        <div className="space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-muted">
          <Input name="title" value={job.title} onChange={handleChange} placeholder="Título" className="mb-2" />
          <Textarea name="description" value={job.description} onChange={handleChange} placeholder="Descripción" className="mb-2" />
          <div>
            <label className="font-semibold">Beneficios</label>
            {Array.isArray(job.benefits) && job.benefits.map((b: string, i: number) => (
              <div key={i} className="flex gap-2 mb-1">
                <Input value={b} onChange={e => handleArrayChange("benefits", e.target.value, i)} placeholder="Beneficio" />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveArrayItem("benefits", i)}>-</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddArrayItem("benefits")}>Agregar beneficio</Button>
          </div>
          <div>
            <label className="font-semibold">Requisitos</label>
            {Array.isArray(job.requirements) && job.requirements.map((r: string, i: number) => (
              <div key={i} className="flex gap-2 mb-1">
                <Input value={r} onChange={e => handleArrayChange("requirements", e.target.value, i)} placeholder="Requisito" />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveArrayItem("requirements", i)}>-</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddArrayItem("requirements")}>Agregar requisito</Button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold">Categoría</label>
              <Input name="category" value={job.category} onChange={handleChange} placeholder="Categoría" />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Modalidad</label>
              <Select value={job.modality} onValueChange={val => setJob({ ...job, modality: val })}>
                <SelectTrigger><SelectValue placeholder="Modalidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold">Tipo de puesto</label>
              <Select value={job.job_type} onValueChange={val => setJob({ ...job, job_type: val })}>
                <SelectTrigger><SelectValue placeholder="Tipo de puesto" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiempo_completo">Tiempo completo</SelectItem>
                  <SelectItem value="medio_tiempo">Medio tiempo</SelectItem>
                  <SelectItem value="por_proyecto">Por proyecto</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="font-semibold">Ubicación</label>
              <Input name="location_text" value={job.location_text || ""} onChange={handleChange} placeholder="Ubicación" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold">Salario mínimo</label>
              <Input name="salary_min" type="number" value={job.salary_min ?? ""} onChange={handleChange} placeholder="Mínimo" />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Salario máximo</label>
              <Input name="salary_max" type="number" value={job.salary_max ?? ""} onChange={handleChange} placeholder="Máximo" />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Moneda</label>
              <Input name="salary_currency" value={job.salary_currency || ""} onChange={handleChange} placeholder="Ej: USD, ARS" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={job.show_salary} onCheckedChange={val => setJob({ ...job, show_salary: val })} id="show_salary" />
            <label htmlFor="show_salary" className="font-semibold">Mostrar salario en la oferta</label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full mt-4">{saving ? "Guardando..." : "Guardar cambios"}</Button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </main>
      <Footer />
    </div>
  )
}

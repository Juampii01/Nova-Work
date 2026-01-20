"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Briefcase, MapPin, Target, Star, CheckCircle2 } from "lucide-react"

interface OnboardingWizardProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    profession: "",
    location: "",
    bio: "",
    skills: [] as string[],
    lookingFor: "",
    experience: "",
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const skills = [
    "JavaScript",
    "React",
    "Python",
    "Diseño UI/UX",
    "Marketing Digital",
    "Gestión de Proyectos",
    "Ventas",
    "Contabilidad",
    "Fotografía",
    "Video Edición",
    "Escritura",
    "Traducción",
    "Atención al Cliente",
  ]

  const toggleSkill = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-heading">Bienvenido a Nova Work</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Paso {step} de {totalSteps}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onSkip} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Progress value={progress} className="mb-8" />

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Briefcase className="h-8 w-8" />
              <h3 className="text-xl font-semibold">¿Cuál es tu profesión?</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="profession">Profesión u oficio</Label>
                <Input
                  id="profession"
                  placeholder="Ej: Desarrollador Web, Diseñador Gráfico, Electricista..."
                  value={userData.profession}
                  onChange={(e) => setUserData((prev) => ({ ...prev, profession: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experience">Años de experiencia</Label>
                <select
                  id="experience"
                  value={userData.experience}
                  onChange={(e) => setUserData((prev) => ({ ...prev, experience: e.target.value }))}
                  className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  <option value="0-1">Menos de 1 año</option>
                  <option value="1-3">1-3 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="5-10">5-10 años</option>
                  <option value="10+">Más de 10 años</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-8 w-8" />
              <h3 className="text-xl font-semibold">¿Dónde trabajas?</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Ciudad o región</Label>
                <Input
                  id="location"
                  placeholder="Ej: Buenos Aires, CDMX, Santiago..."
                  value={userData.location}
                  onChange={(e) => setUserData((prev) => ({ ...prev, location: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Esto nos ayuda a mostrarte trabajos cercanos</p>
              </div>

              <div>
                <Label htmlFor="bio">Cuéntanos sobre ti</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe brevemente tu experiencia y qué te apasiona de tu trabajo..."
                  value={userData.bio}
                  onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Star className="h-8 w-8" />
              <h3 className="text-xl font-semibold">Tus habilidades</h3>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona las habilidades que mejor te representan (máximo 5)
              </p>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const isSelected = userData.skills.includes(skill)
                  return (
                    <Badge
                      key={skill}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      } ${userData.skills.length >= 5 && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (userData.skills.length < 5 || isSelected) {
                          toggleSkill(skill)
                        }
                      }}
                    >
                      {skill}
                      {isSelected && <CheckCircle2 className="h-3 w-3 ml-1" />}
                    </Badge>
                  )
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-4">{userData.skills.length}/5 habilidades seleccionadas</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Target className="h-8 w-8" />
              <h3 className="text-xl font-semibold">¿Qué estás buscando?</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant={userData.lookingFor === "trabajo" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setUserData((prev) => ({ ...prev, lookingFor: "trabajo" }))}
                >
                  <Briefcase className="h-6 w-6" />
                  <span>Busco trabajo</span>
                </Button>

                <Button
                  variant={userData.lookingFor === "talento" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setUserData((prev) => ({ ...prev, lookingFor: "talento" }))}
                >
                  <Star className="h-6 w-6" />
                  <span>Busco talento</span>
                </Button>

                <Button
                  variant={userData.lookingFor === "networking" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setUserData((prev) => ({ ...prev, lookingFor: "networking" }))}
                >
                  <Target className="h-6 w-6" />
                  <span>Networking</span>
                </Button>

                <Button
                  variant={userData.lookingFor === "freelance" ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => setUserData((prev) => ({ ...prev, lookingFor: "freelance" }))}
                >
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Proyectos freelance</span>
                </Button>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Resumen de tu perfil:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {userData.profession || "Profesión no especificada"}</li>
                <li>• {userData.location || "Ubicación no especificada"}</li>
                <li>• {userData.skills.length} habilidades seleccionadas</li>
                <li>• {userData.experience || "Experiencia no especificada"}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            Saltar por ahora
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Atrás
              </Button>
            )}
            <Button onClick={handleNext}>{step === totalSteps ? "Comenzar" : "Siguiente"}</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check } from "lucide-react"
import { createApplication, hasUserApplied } from "@/lib/supabase/database"

interface ApplyButtonProps {
  jobId: string
}

export function ApplyButton({ jobId }: ApplyButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (user?.id) {
      checkIfApplied()
    }
  }, [user?.id, jobId])

  const checkIfApplied = async () => {
    if (!user?.id) return
    try {
      const applied = await hasUserApplied(jobId, user.id)
      setHasApplied(applied)
    } catch (error) {
      console.error("Error checking application:", error)
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para postularte")
      router.push("/auth")
      return
    }

    if (!user?.id) {
      toast.error("Error: No hay usuario autenticado")
      return
    }

    setIsLoading(true)
    try {
      const { success, error } = await createApplication(jobId, user.id)

      if (!success) {
        toast.error(error || "Error al postularse")
        return
      }

      toast.success("¡Te postulaste exitosamente! El recruiter recibirá tu candidatura.")
      setHasApplied(true)
    } catch (error) {
      console.error("Error applying:", error)
      toast.error("Error inesperado al postularse")
    } finally {
      setIsLoading(false)
    }
  }

  if (hasApplied) {
    return (
      <Button disabled className="gap-2 bg-green-500/20 text-green-700 border border-green-300 hover:bg-green-500/30">
        <Check className="w-4 h-4" />
        Ya te postulaste
      </Button>
    )
  }

  return (
    <Button
      onClick={handleApply}
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg"
    >
      {isLoading ? "Postulándose..." : "Postularse"}
    </Button>
  )
}

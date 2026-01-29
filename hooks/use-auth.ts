"use client"

import { useAuthContext } from "@/components/auth-provider"

// Devuelve el contexto global de AuthProvider, pero con alias para compatibilidad
export function useAuth() {
  const ctx = useAuthContext()
  return {
    user: ctx.user,
    profile: null, // Si necesitas perfil, deberías extender el contexto global
    isLoading: ctx.loading,
    isAuthenticated: !!ctx.user,
    signOut: ctx.signOut,
    refetch: async () => {
      // Puedes implementar refetch global aquí si lo necesitas
    },
  }
}

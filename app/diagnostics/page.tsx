"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function DiagnosticsPage() {
  const [status, setStatus] = useState<string>("Cargando...")
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("🔍 [Diagnostics] Starting connection check...")

        // 1. Verificar que el cliente se crea
        const supabase = createClient()
        if (!supabase) {
          setStatus("❌ No se pudo crear el cliente de Supabase")
          return
        }
        console.log("✅ [Diagnostics] Supabase client created")

        // 2. Verificar que las env vars estén presentes
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        console.log("📋 [Diagnostics] Env vars check:", { url: !!url, key: !!key })

        setDetails({
          supabaseUrl: url ? `✅ ${url.substring(0, 30)}...` : "❌ Falta URL",
          supabaseKey: key ? `✅ ${key.substring(0, 20)}...` : "❌ Falta KEY",
        })

        if (!url || !key) {
          setStatus("❌ Faltan variables de entorno")
          return
        }

        // 3. Intentar obtener la sesión actual
        console.log("🔄 [Diagnostics] Checking session...")
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        console.log("📊 [Diagnostics] Session check:", { hasSession: !!sessionData?.session, error: sessionError?.message })

        // 4. Intentar obtener datos de prueba
        console.log("🔄 [Diagnostics] Querying profiles...")
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email")
          .limit(1)

        console.log("📊 [Diagnostics] Profiles check:", { count: profiles?.length, error: profilesError?.message })

        if (profilesError) {
          setStatus(`❌ Error al conectar a BD: ${profilesError.message}`)
          console.error("❌ [Diagnostics] BD Error:", profilesError)
          return
        }

        setStatus("✅ ¡Conexión exitosa a Supabase!")
        setDetails((prev: any) => ({
          ...prev,
          session: sessionData?.session ? "✅ Sesión activa" : "⚠️ Sin sesión",
          profilesAccess: `✅ BD accesible (${profiles?.length || 0} perfiles encontrados)`,
        }))
        console.log("✅ [Diagnostics] ALL CHECKS PASSED!")
      } catch (error) {
        console.error("[Diagnostics] Error:", error)
        const errorMsg = error instanceof Error ? error.message : "Desconocido"
        setStatus(`❌ Error: ${errorMsg}`)
        console.error("❌ [Diagnostics] Exception:", { message: errorMsg, stack: error instanceof Error ? error.stack : "" })
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">🔧 Diagnóstico de Supabase</h1>
            <p className="text-muted-foreground">Verificando conexión...</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <div className="text-lg font-semibold">{status}</div>

            {details && (
              <div className="space-y-2 text-sm font-mono">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-muted-foreground">{key}:</span> <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-2">📝 Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abre la consola del navegador (F12)</li>
              <li>Busca los logs que comienzan con [Diagnostics]</li>
              <li>Comparte lo que ves en la consola</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

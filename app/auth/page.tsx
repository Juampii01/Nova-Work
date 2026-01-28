"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/feed")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const supabase = createClient()
      if (!supabase) {
        toast.error("Error de configuración", {
          description: "El cliente de Supabase no se pudo inicializar",
        })
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
          toast.error("Email no confirmado", {
            description:
              "Por favor, revisa tu bandeja de entrada y confirma tu email antes de iniciar sesión. Si no encuentras el email, revisa tu carpeta de spam.",
            duration: 8000,
          })
        } else if (error.message?.includes("Invalid login credentials")) {
          toast.error("Credenciales inválidas", {
            description: "El email o la contraseña son incorrectos",
          })
        } else {
          toast.error("Error al iniciar sesión", {
            description: error.message || "Ocurrió un error desconocido",
          })
        }
        setIsLoading(false)
        return
      }

      toast.success("¡Bienvenido de vuelta!")
      setIsLoading(false)
    } catch (err) {
      toast.error("Error inesperado", {
        description: err instanceof Error ? err.message : "Ocurrió un error inesperado",
      })
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const email = formData.get("registerEmail") as string
      const password = formData.get("registerPassword") as string
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string

      console.log("[Auth] Registration attempt:", { email, firstName, lastName, password: "***" })

      const supabase = createClient()
      console.log("[Auth] Supabase client created:", !!supabase)

      if (!supabase) {
        console.error("[Auth] Supabase client is null!")
        toast.error("Error de configuración", {
          description: "El cliente de Supabase no se pudo inicializar",
        })
        setIsLoading(false)
        return
      }

      console.log("[Auth] Calling signUp...")
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      console.log("[Auth] SignUp response:", { hasData: !!data, error: error?.message })

      if (error) {
        console.error("[Auth] Registration error details:", {
          message: error.message,
          code: error.code,
          status: error.status,
          name: error.name,
        })
        toast.error("Error al crear cuenta", {
          description: error.message || "Ocurrió un error desconocido",
        })
        setIsLoading(false)
        return
      }

      console.log("[Auth] Registration successful, user created")
      toast.success("¡Cuenta creada!", {
        description: "Revisa tu email para confirmar tu cuenta",
      })
      setIsLoading(false)
    } catch (err) {
      console.error("[Auth] Unexpected error:", err)
      toast.error("Error inesperado", {
        description: err instanceof Error ? err.message : "Ocurrió un error inesperado",
      })
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "github" | "linkedin_oidc" | "facebook") => {
    setIsLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error("Error al conectar", {
        description: error.message,
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/10">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-3 animate-fade-in-up">
            <h2 className="font-heading font-extrabold text-4xl tracking-tight bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-fade-in-up">
              Bienvenido
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in">Conectate con oportunidades laborales cerca tuyo</p>
          </div>

          <Tabs defaultValue="login" className="w-full animate-fade-in-up">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/60 backdrop-blur-xl rounded-2xl shadow-md">
              <TabsTrigger value="login" className="rounded-xl font-semibold text-base data-[state=active]:shadow-lg data-[state=active]:bg-accent/10 transition-all">
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-xl font-semibold text-base data-[state=active]:shadow-lg data-[state=active]:bg-accent/10 transition-all"
              >
                Crear cuenta
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-8 animate-fade-in-up">
              <Card className="border-0 shadow-2xl shadow-accent/10 backdrop-blur-xl bg-white/80 dark:bg-[#1a2f26]/80 animate-fade-in-up">
                <CardHeader className="space-y-3 pb-8">
                  <CardTitle className="text-3xl font-bold">Iniciar sesión</CardTitle>
                  <CardDescription className="text-base">
                    Ingresá a tu cuenta para explorar empleos cerca tuyo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth("google")}
                    disabled={isLoading}
                    className="w-full h-14 text-base bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 hover:border-red-200 dark:hover:border-red-800 shadow-lg transition-all hover:shadow-2xl hover:scale-105 animate-fade-in"
                  >
                    <Chrome className="mr-3 h-6 w-6 text-red-500" />
                    <span className="font-semibold">Continuar con Google</span>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-card px-4 text-muted-foreground font-semibold tracking-wide">
                        O con email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-12 h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="password" className="text-sm font-semibold">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          className="pl-12 pr-14 h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1.5 top-1.5 h-11 px-3 hover:bg-muted/50 rounded-lg"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2.5">
                        <Checkbox id="remember" className="rounded-md w-5 h-5" />
                        <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                          Recordarme
                        </Label>
                      </div>
                      <Link href="/forgot-password" className="text-sm text-accent hover:underline font-semibold">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-bold shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/40 transition-all hover:scale-[1.02] bg-gradient-to-r from-accent to-accent/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-8">
              <Card className="border-0 shadow-2xl shadow-accent/10 backdrop-blur-xl bg-white/80 dark:bg-[#1a2f26]/80 animate-fade-in-up">
                <CardHeader className="space-y-3 pb-8">
                  <CardTitle className="text-3xl font-bold">Crear cuenta</CardTitle>
                  <CardDescription className="text-base">
                    Únete a Nova Work y descubrí empleos cerca tuyo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth("google")}
                    disabled={isLoading}
                    className="w-full h-14 text-base bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 hover:border-red-200 dark:hover:border-red-800 shadow-lg transition-all hover:shadow-2xl hover:scale-105 animate-fade-in"
                  >
                    <Chrome className="mr-3 h-6 w-6 text-red-500" />
                    <span className="font-semibold">Registrarse con Google</span>
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-card px-4 text-muted-foreground font-semibold tracking-wide">
                        O con email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <Label htmlFor="firstName" className="text-sm font-semibold">
                          Nombre
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Juan"
                            className="pl-12 h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="lastName" className="text-sm font-semibold">
                          Apellido
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Pérez"
                          className="h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="registerEmail" className="text-sm font-semibold">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="registerEmail"
                          name="registerEmail"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-12 h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="registerPassword" className="text-sm font-semibold">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="registerPassword"
                          name="registerPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="pl-12 pr-14 h-14 text-base border-2 rounded-xl focus:border-accent transition-all shadow-sm"
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1.5 top-1.5 h-11 px-3 hover:bg-muted/50 rounded-lg"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-1 rounded-md w-5 h-5"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        Acepto los{" "}
                        <Link href="/terms" className="text-accent hover:underline font-semibold">
                          términos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link href="/privacy" className="text-accent hover:underline font-semibold">
                          política de privacidad
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-bold shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/40 transition-all hover:scale-[1.02] bg-gradient-to-r from-accent to-accent/90"
                      disabled={isLoading || !acceptTerms}
                    >
                      {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground px-4">
            <p className="leading-relaxed">
              Al crear una cuenta, aceptás recibir comunicaciones de Nova Work. Podés darte de baja en cualquier
              momento.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setEmailSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">N</span>
              </div>
              <span className="font-heading font-bold text-2xl">Nova Work</span>
            </div>
            <h2 className="font-heading font-bold text-3xl">{emailSent ? "Email enviado" : "Recuperar contraseña"}</h2>
            <p className="text-muted-foreground mt-2">
              {emailSent
                ? "Te enviamos un link para restablecer tu contraseña"
                : "Ingresá tu email para recibir un link de recuperación"}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {emailSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Enviamos un email a <strong>{email}</strong> con las instrucciones para restablecer tu contraseña.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Si no lo ves en tu bandeja de entrada, revisá la carpeta de spam.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full bg-transparent">
                      Enviar a otro email
                    </Button>
                    <Link href="/auth">
                      <Button className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar link de recuperación"}
                  </Button>

                  <div className="text-center">
                    <Link href="/auth" className="text-sm text-accent hover:underline inline-flex items-center">
                      <ArrowLeft className="mr-1 h-3 w-3" />
                      Volver al login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

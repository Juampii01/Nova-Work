import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export function CandidateDashboard() {
  const { profile } = require("@/hooks/use-auth.ts")
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 to-primary/10">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-2 animate-fade-in-up">Dashboard de Candidato</h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in">Tus postulaciones y chats con empleadores</p>
        {/* Mis postulaciones reales */}
        {profile?.id && require("@/components/candidate-applications.tsx").CandidateApplications({ userId: profile.id })}
        {/* Accesos rápidos a chats */}
        <Card className="mt-8 backdrop-blur-xl bg-white/80 dark:bg-[#1a2f26]/80 border-0 shadow-xl animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-xl">Chats con empleadores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">(Próximamente: accesos rápidos a conversaciones)</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

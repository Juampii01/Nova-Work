import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function RoleOnboarding({ onSelect }: { onSelect: (role: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
      <Card className="max-w-md w-full backdrop-blur-xl bg-white/80 dark:bg-[#1a2f26]/80 border-0 shadow-2xl animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">¿Qué modo prefieres?</CardTitle>
          <CardDescription className="text-lg">Selecciona tu rol para personalizar tu experiencia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mt-2">
            <button className="px-6 py-3 rounded-xl bg-accent text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-fade-in" onClick={() => onSelect("candidate")}>👤 Busco empleo</button>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-fade-in delay-100" onClick={() => onSelect("recruiter")}>💼 Ofrezco empleo</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

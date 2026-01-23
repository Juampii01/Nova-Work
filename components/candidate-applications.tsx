import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getApplicationsByUser } from "@/lib/supabase/database"

export function CandidateApplications({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<any[]>([])
  useEffect(() => {
    if (!userId) return
    getApplicationsByUser(userId).then(setApplications)
  }, [userId])

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Mis postulaciones</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No tienes postulaciones aún.</p>
        ) : (
          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app.id} className="border-b pb-2">
                <span className="font-medium">{app.jobs?.title || "Oferta"}</span>
                <span className="ml-2 text-xs text-muted-foreground">{app.status}</span>
                <span className="ml-2 text-xs">{new Date(app.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getRecruiterJobs, getJobApplications } from "@/lib/supabase/database"

export function RecruiterApplications({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    getRecruiterJobs(userId).then(jobsData => {
      setJobs(jobsData)
      if (jobsData.length > 0) {
        setSelectedJobId(jobsData[0].id)
      }
    })
  }, [userId])

  useEffect(() => {
    if (!selectedJobId) return
    getJobApplications(selectedJobId).then(setApplications)
  }, [selectedJobId])

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Postulaciones recibidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium">Oferta:</label>
          <select value={selectedJobId || ""} onChange={e => setSelectedJobId(e.target.value)} className="ml-2 px-2 py-1 rounded border">
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No hay postulaciones para esta oferta.</p>
        ) : (
          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app.id} className="border-b pb-2">
                <span className="font-medium">{app.profiles?.full_name || "Candidato"}</span>
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

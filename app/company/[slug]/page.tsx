import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Verified, MapPin, Clock, Briefcase, MessageCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

type Company = Database["public"]["Tables"]["companies"]["Row"]
type Job = Database["public"]["Tables"]["jobs"]["Row"]

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, website, description, is_verified, logo_url")
    .eq("slug", params.slug)
    .single()

  const company = companyData as Company

  if (companyError || !company) {
    notFound()
  }

  const { data: jobsData } = await supabase
    .from("jobs")
    .select("id, title, location_text, modality, job_type, status, created_at, salary_min, salary_max, salary_currency, description")
    .eq("company_id", company.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  const jobs = (jobsData ?? []) as Job[]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Company Header */}
          <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/2">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {company.logo_url && (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-16 h-16 rounded-lg object-cover bg-white"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-heading font-bold text-3xl md:text-4xl">{company.name}</h1>
                        {company.is_verified && (
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                            <Verified className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Verificada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                      {company.description}
                    </p>
                  )}

                  {company.website && (
                    <div className="flex items-center gap-2">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        Sitio web →
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-fit">
                  <Button className="w-full md:w-auto" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    {jobs.length} {jobs.length === 1 ? "empleo abierto" : "empleos abiertos"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Company */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-heading font-semibold text-xl mb-4">Sobre la empresa</h2>
              {company.description ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">La empresa aún no ha compartido información sobre sí misma.</p>
              )}
              
              {company.website && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sitio web:</span>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jobs Section */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-2xl">Empleos publicados</h2>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">Sin empleos activos</h3>
                  <p className="text-muted-foreground mb-6">
                    Esta empresa no tiene empleos disponibles en este momento
                  </p>
                  <Link href="/feed">
                    <Button variant="outline">Explorar otros empleos</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="font-heading font-semibold text-lg hover:text-accent transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          {job.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {job.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {job.modality && (
                              <Badge variant="outline" className="text-xs">
                                {job.modality}
                              </Badge>
                            )}
                            {job.job_type && (
                              <Badge variant="outline" className="text-xs">
                                {job.job_type}
                              </Badge>
                            )}
                            {(job.salary_min || job.salary_max) && (
                              <Badge className="text-xs flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                {job.salary_min && `${job.salary_currency ?? "$"}${job.salary_min}`}
                                {job.salary_min && job.salary_max && " - "}
                                {job.salary_max && `${job.salary_currency ?? "$"}${job.salary_max}`}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                            <div className="flex items-center gap-4">
                              {job.location_text && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{job.location_text}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recientemente"}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

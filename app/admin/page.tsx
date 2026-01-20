"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check, X, Clock, Mail } from "lucide-react"
import { getBetaRequests, updateBetaRequestStatus } from "@/lib/supabase/database"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      // TODO: Check if user is admin (add admin flag to profiles table)
      setIsAdmin(true)

      const data = await getBetaRequests()
      setRequests(data)
      setIsLoading(false)
    }

    checkAdminAndLoadData()
  }, [router])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateBetaRequestStatus(id, status)
      setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch (error) {
      console.error("[v0] Error updating status:", error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">Gestiona las solicitudes de beta testing</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Beta Testing</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando solicitudes...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay solicitudes pendientes</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Profesión</TableHead>
                      <TableHead>Razón</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.full_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{request.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{request.profession}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {request.status === "approved" && <Check className="w-3 h-3 mr-1" />}
                            {request.status === "rejected" && <X className="w-3 h-3 mr-1" />}
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {request.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => handleStatusChange(request.id, "approved")}>
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusChange(request.id, "rejected")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

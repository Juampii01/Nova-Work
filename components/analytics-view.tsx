"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsViewsProps {
  viewsData: Array<{ date: string; applications: number }>
  categoryData: Array<{ category: string; applications: number }>
  statusData: { pending: number; viewed: number; accepted: number; rejected: number }
}

const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
}

const STATUS_COLORS = {
  pending: COLORS.warning,
  viewed: COLORS.accent,
  accepted: COLORS.success,
  rejected: COLORS.danger,
}

export function AnalyticsView({ viewsData, categoryData, statusData }: AnalyticsViewsProps) {
  // Prepare status data for pie chart
  const statusChartData = useMemo(
    () =>
      [
        { name: "Pendientes", value: statusData.pending, color: STATUS_COLORS.pending },
        { name: "Vistos", value: statusData.viewed, color: STATUS_COLORS.viewed },
        { name: "Aceptados", value: statusData.accepted, color: STATUS_COLORS.accepted },
        { name: "Rechazados", value: statusData.rejected, color: STATUS_COLORS.rejected },
      ].filter((d) => d.value > 0),
    [statusData]
  )

  const totalApplications =
    statusData.pending + statusData.viewed + statusData.accepted + statusData.rejected

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Aplicaciones totales</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-warning">{statusData.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Pendientes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-success">{statusData.accepted}</div>
            <p className="text-xs text-muted-foreground mt-1">Aceptados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent">
              {((statusData.accepted / totalApplications) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tasa de contratación</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Aplicaciones por Día</CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => date.slice(0, 5)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value} apps`, "Aplicaciones"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Applications by Category */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Aplicaciones por Categoría</CardTitle>
            <CardDescription>Distribución por tipo de trabajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value} aplicaciones`, "Total"]}
                  />
                  <Bar dataKey="applications" fill={COLORS.secondary} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Estado de Aplicaciones</CardTitle>
            <CardDescription>Resumen por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `${value} aplicaciones`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Información</CardTitle>
            <CardDescription>Resumen de métricas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div>
                  <p className="font-semibold text-sm">Pendientes de revisión</p>
                  <p className="text-xs text-muted-foreground">Aplicaciones sin revisar</p>
                </div>
                <span className="text-2xl font-bold text-warning">{statusData.pending}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div>
                  <p className="font-semibold text-sm">Vistos</p>
                  <p className="text-xs text-muted-foreground">En proceso de análisis</p>
                </div>
                <span className="text-2xl font-bold text-accent">{statusData.viewed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                <div>
                  <p className="font-semibold text-sm">Aceptados</p>
                  <p className="text-xs text-muted-foreground">Candidatos seleccionados</p>
                </div>
                <span className="text-2xl font-bold text-success">{statusData.accepted}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-danger/10 rounded-lg border border-danger/20">
                <div>
                  <p className="font-semibold text-sm">Rechazados</p>
                  <p className="text-xs text-muted-foreground">No continuarán en proceso</p>
                </div>
                <span className="text-2xl font-bold text-danger">{statusData.rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

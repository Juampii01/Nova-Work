
// Instalación recomendada: npm install leaflet.markercluster
import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"

export interface MapMarker {
  id: string
  type: "job" | "candidate"
  lat: number
  lng: number
  title: string
  subtitle: string
}

interface MapViewProps {
  markers: MapMarker[]
  center: { lat: number; lng: number }
  zoom?: number
}

export function MapView({ markers, center, zoom = 13 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'job' | 'candidate'>('all')

  useEffect(() => {
    if (!mapRef.current) return
    if (leafletMapRef.current) return
    leafletMapRef.current = L.map(mapRef.current).setView([center.lat, center.lng], zoom)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(leafletMapRef.current)
  }, [center, zoom])

  useEffect(() => {
    if (!leafletMapRef.current) return
    if (markerClusterRef.current) {
      markerClusterRef.current.clearLayers()
      leafletMapRef.current.removeLayer(markerClusterRef.current)
    }
    markerClusterRef.current = L.markerClusterGroup()
    const filtered = filterType === "all" ? markers : markers.filter((m) => m.type === filterType)
    filtered.forEach((m) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style='background:#fff;border-radius:8px;padding:4px 8px;box-shadow:0 2px 8px #0002;display:flex;align-items:center;gap:4px;'>${m.type === "job" ? "<span style='color:#0ea5e9;'>💼</span>" : "<span style='color:#0ea5e9;'>👤</span>"}<span>${m.title}</span></div>`
      })
      const marker = L.marker([m.lat, m.lng], { icon })
      const url = m.type === "job" ? `/job/${m.id}` : `/u/${m.id}`
      marker.bindPopup(`
        <div style='min-width:180px;'>
          <div style='font-weight:bold;font-size:1rem;'>${m.title}</div>
          <div style='color:#555;font-size:0.95rem;'>${m.subtitle}</div>
          <a href='${url}' style='display:inline-block;margin-top:8px;padding:6px 12px;background:#0ea5e9;color:#fff;border-radius:6px;text-decoration:none;font-size:0.95rem;'>Ver detalles</a>
        </div>
      `)
      if (markerClusterRef.current) {
        markerClusterRef.current.addLayer(marker)
      }
    })
    markerClusterRef.current.addTo(leafletMapRef.current)
  }, [markers, filterType])

  return (
    <Card className="w-full relative overflow-hidden h-[32rem] sm:h-96 bg-gradient-to-br from-accent/5 to-primary/10 border-0 shadow-2xl animate-fade-in-up">
      <div ref={mapRef} className="absolute inset-0 rounded-2xl" />
      {/* Filtros dinámicos, glassmorphism, iconos y animaciones */}
      <div
        className="absolute z-10 flex flex-col sm:flex-row gap-2 sm:gap-2 top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 backdrop-blur-xl bg-white/70 dark:bg-[#1a2f26]/80 border border-accent/10 rounded-2xl shadow-xl p-2 sm:p-2 w-[95vw] max-w-xs sm:max-w-none sm:w-auto animate-fade-in"
        style={{ boxShadow: '0 4px 24px #0fa36b22' }}
      >
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-base shadow-sm ${filterType === "all" ? "bg-accent text-white scale-105 shadow-lg" : "bg-muted text-foreground hover:bg-accent/10"}`}
          onClick={() => setFilterType('all')}
        >
          <span role="img" aria-label="Todos">🌍</span> Todos
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-base shadow-sm ${filterType === "job" ? "bg-accent text-white scale-105 shadow-lg" : "bg-muted text-foreground hover:bg-accent/10"}`}
          onClick={() => setFilterType('job')}
        >
          <span role="img" aria-label="Empleos">💼</span> Empleos
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-base shadow-sm ${filterType === "candidate" ? "bg-accent text-white scale-105 shadow-lg" : "bg-muted text-foreground hover:bg-accent/10"}`}
          onClick={() => setFilterType('candidate')}
        >
          <span role="img" aria-label="Candidatos">👤</span> Candidatos
        </button>
      </div>
    </Card>
  )
}

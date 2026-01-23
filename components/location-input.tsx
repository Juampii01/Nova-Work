import { useState } from "react"

export interface LocationData {
  city: string
  region: string
  country: string
  lat: number | null
  lng: number | null
  raw: string
}

interface LocationInputProps {
  value: LocationData
  onChange: (value: LocationData) => void
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [input, setInput] = useState(value.raw)

  // Simulación de autocompletado y geocodificación
  // En producción, integrar con Google Places, Mapbox, etc.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInput(raw)
    // Lógica simple para parsear ciudad, región, país (mejorar con API real)
    const parts = raw.split(",").map((p) => p.trim())
    const city = parts[0] || ""
    const region = parts[1] || ""
    const country = parts[2] || ""
    // Simulación: lat/lng null
    onChange({ city, region, country, lat: null, lng: null, raw })
  }

  return (
    <div className="space-y-2">
      <label className="font-semibold">Ubicación (autocompletado)</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded"
        placeholder="Ej: Palermo, CABA, Argentina"
        value={input}
        onChange={handleInputChange}
      />
      <div className="text-xs text-muted-foreground mt-1">
        Ciudad: <b>{value.city}</b> | Región: <b>{value.region}</b> | País: <b>{value.country}</b>
      </div>
    </div>
  )
}

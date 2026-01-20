"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, className, priority = false }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("overflow-hidden", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width || 800}
        height={height || 600}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("duration-700 ease-in-out", isLoading ? "scale-105 blur-sm" : "scale-100 blur-0")}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

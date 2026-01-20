"use client"

import { Suspense, type ReactNode } from "react"

interface LazyLoaderProps {
  children: ReactNode
  fallback?: ReactNode
}

export function LazyLoader({ children, fallback = <LoadingSkeleton /> }: LazyLoaderProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  )
}

export default function RecommendationsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Cargando recomendaciones personalizadas...</p>
      </div>
    </div>
  )
}

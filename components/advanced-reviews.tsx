"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, ThumbsDown, Flag, MessageCircle, Award, TrendingUp, Filter, SortDesc } from "lucide-react"

interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    isVerified: boolean
    handle: string
  }
  rating: number
  comment: string
  date: Date
  project: string
  category: string
  helpful: number
  notHelpful: number
  isHelpful?: boolean
  tags: string[]
  response?: {
    text: string
    date: Date
  }
}

interface ReviewStats {
  average: number
  total: number
  distribution: { [key: number]: number }
  categories: { [key: string]: { average: number; count: number } }
  recentTrend: "up" | "down" | "stable"
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: {
      name: "María González",
      isVerified: true,
      handle: "maria-gonzalez",
    },
    rating: 5,
    comment:
      "Excelente trabajo en carpintería. Muy prolijo y cumplió con los tiempos acordados. La calidad de los materiales es excepcional y el acabado impecable. Definitivamente lo recomiendo para proyectos similares.",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    project: "Muebles de cocina a medida",
    category: "Carpintería",
    helpful: 12,
    notHelpful: 1,
    tags: ["Puntual", "Calidad", "Profesional"],
    response: {
      text: "Muchas gracias María! Fue un placer trabajar en tu proyecto. Me alegra que hayas quedado satisfecha con el resultado.",
      date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    },
  },
  {
    id: "2",
    author: {
      name: "Carlos Rodríguez",
      isVerified: true,
      handle: "carlos-rodriguez",
    },
    rating: 5,
    comment:
      "Profesional y responsable. Recomiendo sus servicios sin dudas. Excelente comunicación durante todo el proceso.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    project: "Reparación de muebles",
    category: "Reparaciones",
    helpful: 8,
    notHelpful: 0,
    tags: ["Comunicativo", "Confiable"],
  },
  {
    id: "3",
    author: {
      name: "Ana López",
      isVerified: false,
      handle: "ana-lopez",
    },
    rating: 4,
    comment: "Buen trabajo, aunque se demoró un poco más de lo esperado. El resultado final fue satisfactorio.",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    project: "Estantería personalizada",
    category: "Carpintería",
    helpful: 5,
    notHelpful: 2,
    tags: ["Calidad"],
  },
  {
    id: "4",
    author: {
      name: "Roberto Silva",
      isVerified: true,
      handle: "roberto-silva",
    },
    rating: 5,
    comment: "Increíble atención al detalle. Superó mis expectativas completamente. Muy recomendable.",
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    project: "Mesa de comedor",
    category: "Carpintería",
    helpful: 15,
    notHelpful: 0,
    tags: ["Detallista", "Creativo", "Profesional"],
  },
]

const mockStats: ReviewStats = {
  average: 4.8,
  total: 45,
  distribution: {
    5: 32,
    4: 8,
    3: 3,
    2: 1,
    1: 1,
  },
  categories: {
    Carpintería: { average: 4.9, count: 28 },
    Reparaciones: { average: 4.7, count: 12 },
    Diseño: { average: 4.8, count: 5 },
  },
  recentTrend: "up",
}

interface AdvancedReviewsProps {
  userId: string
  canLeaveReview?: boolean
}

export default function AdvancedReviews({ userId, canLeaveReview = false }: AdvancedReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [stats] = useState<ReviewStats>(mockStats)
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent")
  const [filterBy, setFilterBy] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    project: "",
    category: "",
    tags: [] as string[],
  })

  const sortedAndFilteredReviews = reviews
    .filter((review) => {
      if (filterBy !== "all" && review.rating !== Number.parseInt(filterBy)) return false
      if (categoryFilter !== "all" && review.category !== categoryFilter) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return b.helpful - b.notHelpful - (a.helpful - a.notHelpful)
        case "rating":
          return b.rating - a.rating
        case "recent":
        default:
          return b.date.getTime() - a.date.getTime()
      }
    })

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          if (review.isHelpful === isHelpful) {
            // Remove vote
            return {
              ...review,
              helpful: isHelpful ? review.helpful - 1 : review.helpful,
              notHelpful: !isHelpful ? review.notHelpful - 1 : review.notHelpful,
              isHelpful: undefined,
            }
          } else {
            // Change or add vote
            return {
              ...review,
              helpful: isHelpful ? review.helpful + 1 : review.isHelpful === true ? review.helpful - 1 : review.helpful,
              notHelpful: !isHelpful
                ? review.notHelpful + 1
                : review.isHelpful === false
                  ? review.notHelpful - 1
                  : review.notHelpful,
              isHelpful: isHelpful,
            }
          }
        }
        return review
      }),
    )
  }

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) return

    const review: Review = {
      id: Date.now().toString(),
      author: {
        name: "Usuario Actual",
        isVerified: true,
        handle: "usuario-actual",
      },
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date(),
      project: newReview.project,
      category: newReview.category,
      helpful: 0,
      notHelpful: 0,
      tags: newReview.tags,
    }

    setReviews((prev) => [review, ...prev])
    setNewReview({ rating: 0, comment: "", project: "", category: "", tags: [] })
    setIsWritingReview(false)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hoy"
    if (diffInDays === 1) return "Ayer"
    if (diffInDays < 7) return `hace ${diffInDays} días`
    if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} semanas`
    if (diffInDays < 365) return `hace ${Math.floor(diffInDays / 30)} meses`
    return `hace ${Math.floor(diffInDays / 365)} años`
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Resumen de Reseñas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{stats.average}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(stats.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Basado en {stats.total} reseñas</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Tendencia positiva</span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <Progress value={(stats.distribution[rating] / stats.total) * 100} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">{stats.distribution[rating]}</span>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Por Categoría</h4>
              {Object.entries(stats.categories).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{data.average}</span>
                    <span className="text-xs text-muted-foreground">({data.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="helpful">Más útiles</SelectItem>
              <SelectItem value="rating">Mejor valoradas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="5">5 estrellas</SelectItem>
              <SelectItem value="4">4 estrellas</SelectItem>
              <SelectItem value="3">3 estrellas</SelectItem>
              <SelectItem value="2">2 estrellas</SelectItem>
              <SelectItem value="1">1 estrella</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Carpintería">Carpintería</SelectItem>
              <SelectItem value="Reparaciones">Reparaciones</SelectItem>
              <SelectItem value="Diseño">Diseño</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {canLeaveReview && (
          <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
            <DialogTrigger asChild>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Escribir Reseña
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Escribir una reseña</DialogTitle>
                <DialogDescription>Comparte tu experiencia para ayudar a otros usuarios</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Calificación</Label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => setNewReview((prev) => ({ ...prev, rating }))}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="project">Proyecto</Label>
                  <input
                    id="project"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Ej: Muebles de cocina"
                    value={newReview.project}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, project: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={newReview.category}
                    onValueChange={(value) => setNewReview((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carpintería">Carpintería</SelectItem>
                      <SelectItem value="Reparaciones">Reparaciones</SelectItem>
                      <SelectItem value="Diseño">Diseño</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="comment">Comentario</Label>
                  <Textarea
                    id="comment"
                    placeholder="Describe tu experiencia..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsWritingReview(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitReview} disabled={newReview.rating === 0 || !newReview.comment.trim()}>
                  Publicar Reseña
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedAndFilteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-nova-accent/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-nova-accent text-sm">{review.author.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.author.name}</span>
                        {review.author.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(review.date)}</span>
                        <span>•</span>
                        <span>{review.project}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

                  {/* Tags */}
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Professional Response */}
                  {review.response && (
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-nova-accent">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">Respuesta del profesional</span>
                        <span className="text-xs text-muted-foreground">{formatDate(review.response.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.response.text}</p>
                    </div>
                  )}
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, true)}
                      className={`gap-1 ${review.isHelpful === true ? "text-green-600" : ""}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Útil ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id, false)}
                      className={`gap-1 ${review.isHelpful === false ? "text-red-600" : ""}`}
                    >
                      <ThumbsDown className="h-4 w-4" />({review.notHelpful})
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    Reportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedAndFilteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No hay reseñas que coincidan</h3>
            <p className="text-muted-foreground">Intenta cambiar los filtros para ver más reseñas</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

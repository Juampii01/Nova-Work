"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Medal,
  Award,
  Gift,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  FileText,
  CheckCircle,
  Flame,
} from "lucide-react"

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  // User stats and level system
  const userStats = {
    level: 12,
    xp: 2850,
    xpToNext: 3200,
    streak: 7,
    totalPoints: 15420,
    rank: "Gold",
    completedChallenges: 23,
    badges: 15,
  }

  // Achievement categories
  const categories = [
    { id: "all", name: "Todos", icon: Trophy },
    { id: "profile", name: "Perfil", icon: Users },
    { id: "networking", name: "Networking", icon: MessageCircle },
    { id: "learning", name: "Aprendizaje", icon: Target },
    { id: "career", name: "Carrera", icon: TrendingUp },
    { id: "community", name: "Comunidad", icon: Users },
  ]

  // Achievements data
  const achievements = [
    {
      id: "1",
      title: "Primer Paso",
      description: "Completá tu perfil por primera vez",
      category: "profile",
      points: 100,
      xp: 50,
      icon: CheckCircle,
      completed: true,
      rarity: "common",
      completedDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Networker Estrella",
      description: "Conectá con 50 profesionales",
      category: "networking",
      points: 500,
      xp: 250,
      icon: Users,
      completed: true,
      rarity: "rare",
      completedDate: "2024-02-20",
      progress: 50,
      target: 50,
    },
    {
      id: "3",
      title: "Conversador Activo",
      description: "Enviá 100 mensajes en chats",
      category: "networking",
      points: 300,
      xp: 150,
      icon: MessageCircle,
      completed: false,
      rarity: "uncommon",
      progress: 67,
      target: 100,
    },
    {
      id: "4",
      title: "Maestro del Portfolio",
      description: "Subí 10 proyectos a tu portfolio",
      category: "profile",
      points: 800,
      xp: 400,
      icon: FileText,
      completed: false,
      rarity: "epic",
      progress: 6,
      target: 10,
    },
    {
      id: "5",
      title: "Racha de Fuego",
      description: "Mantené una racha de 30 días activo",
      category: "community",
      points: 1000,
      xp: 500,
      icon: Flame,
      completed: false,
      rarity: "legendary",
      progress: 7,
      target: 30,
    },
    {
      id: "6",
      title: "Evento Social",
      description: "Asistí a 5 eventos de networking",
      category: "networking",
      points: 400,
      xp: 200,
      icon: Calendar,
      completed: true,
      rarity: "rare",
      completedDate: "2024-03-10",
    },
    {
      id: "7",
      title: "Mentor Sabio",
      description: "Ayudá a 20 personas con consejos",
      category: "community",
      points: 600,
      xp: 300,
      icon: Award,
      completed: false,
      rarity: "epic",
      progress: 12,
      target: 20,
    },
    {
      id: "8",
      title: "Freelancer Pro",
      description: "Completá 10 trabajos freelance",
      category: "career",
      points: 1200,
      xp: 600,
      icon: Crown,
      completed: false,
      rarity: "legendary",
      progress: 3,
      target: 10,
    },
  ]

  // Daily challenges
  const dailyChallenges = [
    {
      id: "d1",
      title: "Conectá con 3 personas nuevas",
      description: "Expandí tu red profesional",
      points: 50,
      xp: 25,
      progress: 1,
      target: 3,
      timeLeft: "18h",
    },
    {
      id: "d2",
      title: "Actualizá tu estado",
      description: "Compartí qué estás haciendo hoy",
      points: 30,
      xp: 15,
      progress: 0,
      target: 1,
      timeLeft: "18h",
    },
    {
      id: "d3",
      title: "Comentá en 5 publicaciones",
      description: "Participá en la comunidad",
      points: 40,
      xp: 20,
      progress: 2,
      target: 5,
      timeLeft: "18h",
    },
  ]

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: "Ana García", points: 25680, level: 18, avatar: "A" },
    { rank: 2, name: "Carlos López", points: 22340, level: 16, avatar: "C" },
    { rank: 3, name: "María Rodríguez", points: 19850, level: 15, avatar: "M" },
    { rank: 4, name: "Tú", points: 15420, level: 12, avatar: "T", isUser: true },
    { rank: 5, name: "Diego Fernández", points: 14200, level: 11, avatar: "D" },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 bg-gray-100"
      case "uncommon":
        return "text-green-600 bg-green-100"
      case "rare":
        return "text-blue-600 bg-blue-100"
      case "epic":
        return "text-purple-600 bg-purple-100"
      case "legendary":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with user stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Sistema de Logros</h1>
              <p className="text-muted-foreground">Completá desafíos, ganá puntos y desbloqueá recompensas</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-lg">Nivel {userStats.level}</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Rango {userStats.rank}</Badge>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-accent mr-1" />
                  <span className="font-semibold">{userStats.xp.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {userStats.xpToNext - userStats.xp} XP para nivel {userStats.level + 1}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-5 h-5 text-orange-500 mr-1" />
                  <span className="font-semibold">{userStats.streak}</span>
                </div>
                <p className="text-sm text-muted-foreground">Días de Racha</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-accent mr-1" />
                  <span className="font-semibold">{userStats.badges}</span>
                </div>
                <p className="text-sm text-muted-foreground">Logros Desbloqueados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{userStats.totalPoints.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Puntos Totales</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="challenges">Desafíos Diarios</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                )
              })}
            </div>

            {/* Achievements grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card
                    key={achievement.id}
                    className={`relative ${achievement.completed ? "border-green-200 bg-green-50/50" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.completed ? "bg-green-100" : "bg-muted"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${
                                achievement.completed ? "text-green-600" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        {achievement.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

                      {!achievement.completed && achievement.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <Progress value={(achievement.progress / achievement.target) * 100} />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{achievement.points}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium">{achievement.xp}</span>
                          </div>
                        </div>
                        {achievement.completed && achievement.completedDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.completedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Desafíos Diarios</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Completá estos desafíos antes de que termine el día para ganar puntos extra
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{challenge.points}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-accent" />
                            <span className="text-sm">{challenge.xp}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {challenge.timeLeft} restantes
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-medium mb-1">
                          {challenge.progress}/{challenge.target}
                        </div>
                        <Progress value={(challenge.progress / challenge.target) * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Medal className="w-5 h-5" />
                  <span>Ranking Mensual</span>
                </CardTitle>
                <p className="text-muted-foreground">Los usuarios más activos de este mes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.isUser ? "bg-accent/10 border border-accent/20" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          {user.rank <= 3 ? (
                            <Medal
                              className={`w-6 h-6 ${
                                user.rank === 1
                                  ? "text-yellow-500"
                                  : user.rank === 2
                                    ? "text-gray-400"
                                    : "text-amber-600"
                              }`}
                            />
                          ) : (
                            <span className="font-bold text-muted-foreground">#{user.rank}</span>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-accent">{user.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">Nivel {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{user.points.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">puntos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rewards section */}
        <Card className="mt-8 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Próxima Recompensa</h3>
                  <p className="text-muted-foreground">
                    Alcanzá el nivel 15 para desbloquear funciones premium por 1 mes gratis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progreso al nivel 15</p>
                <Progress value={75} className="w-32 mt-1" />
                <p className="text-xs text-muted-foreground mt-1">350 XP restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ChatModal } from "@/components/chat-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Conversation {
  userId: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  profile: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Debes iniciar sesión")
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      if (!user?.id) return
      setIsLoading(true)
      try {
        const { getConversationList } = await import("@/lib/supabase/database")
        const convo = await getConversationList(user.id)
        setConversations(convo)
      } catch (error) {
        console.error("Error loading conversations:", error)
        toast.error("Error al cargar mensajes")
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()

    // Refresh every 5 seconds for new conversations
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [user?.id])

  const handleOpenChat = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setChatOpen(true)
  }

  const handleChatClose = () => {
    setChatOpen(false)
    // Reload conversations
    if (user?.id) {
      import("@/lib/supabase/database").then(({ getConversationList }) => {
        getConversationList(user.id).then(setConversations)
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mis Mensajes</h1>
          <p className="text-muted-foreground">Comunicate con candidatos y recruiters</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Sin conversaciones aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card
                key={conversation.userId}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenChat(conversation)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-accent">
                        {(conversation.profile.full_name?.[0] || "U").toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <h3 className="font-semibold">{conversation.profile.full_name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.lastMessageTime).toLocaleString("es-AR", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {conversation.unread && (
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedConversation && (
        <ChatModal
          open={chatOpen}
          onOpenChange={(open) => {
            if (!open) handleChatClose()
            setChatOpen(open)
          }}
          candidateName={selectedConversation.profile.full_name}
          candidateId={selectedConversation.userId}
          currentUserId={user?.id || ""}
        />
      )}

      <Footer />
    </div>
  )
}

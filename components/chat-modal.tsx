"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read: boolean
}

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateName: string
  candidateId: string
  currentUserId: string
}

export function ChatModal({
  open,
  onOpenChange,
  candidateName,
  candidateId,
  currentUserId,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages
  useEffect(() => {
    if (!open) return

    async function loadMessages() {
      setIsLoading(true)
      try {
        const { getConversation, markMessagesAsRead } = await import("@/lib/supabase/database")
        const convo = await getConversation(currentUserId, candidateId)
        setMessages(convo)

        // Mark as read
        await markMessagesAsRead(currentUserId, candidateId)
      } catch (error) {
        console.error("Error loading messages:", error)
        toast.error("Error al cargar mensajes")
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const supabase = createClient()
    const subscription = supabase
      .channel(`messages_${currentUserId}_${candidateId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${currentUserId},recipient_id.eq.${candidateId}),and(sender_id.eq.${candidateId},recipient_id.eq.${currentUserId}))`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [open, currentUserId, candidateId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      const { sendMessage } = await import("@/lib/supabase/database")
      const result = await sendMessage(currentUserId, candidateId, newMessage.trim())

      if (result.success) {
        setNewMessage("")
        // Message will appear via subscription
      } else {
        toast.error(result.error || "Error al enviar mensaje")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error al enviar mensaje")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-xl max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chat con {candidateName}</DialogTitle>
          <DialogDescription>Comunicate con el candidato</DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] space-y-3 px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Sin mensajes aún. ¡Sé el primero en escribir!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === currentUserId
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className={`text-xs mt-1 block ${msg.sender_id === currentUserId ? "text-accent/80" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <Separator />

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex-shrink-0 flex gap-2 p-4">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={isSending || !newMessage.trim()} size="sm" className="gap-2">
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Enviar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

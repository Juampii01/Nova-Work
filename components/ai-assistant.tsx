"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Bot, X, Send, Sparkles, Loader2, Lightbulb, FileText, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hola! Soy tu asistente de IA en Nova Work. Puedo ayudarte a mejorar tu perfil, encontrar trabajos ideales, redactar mensajes profesionales y mucho más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("perfil") || lowerInput.includes("curriculum") || lowerInput.includes("cv")) {
      return "Te recomiendo mejorar tu perfil con estos pasos:\n\n1. Agrega una foto profesional de alta calidad\n2. Completa tu experiencia laboral con logros cuantificables\n3. Añade al menos 5 habilidades relevantes\n4. Solicita recomendaciones de colegas anteriores\n5. Verifica tu identidad para aumentar la confianza\n\n¿Quieres que te ayude a redactar alguna sección específica?"
    }

    if (lowerInput.includes("trabajo") || lowerInput.includes("empleo") || lowerInput.includes("buscar")) {
      return "Encontré estas oportunidades perfectas para ti:\n\n📍 Desarrollador Frontend - 2km de distancia\n💰 $80,000 - $100,000/año\n⭐ Match: 95%\n\n📍 Diseñador UX/UI - 5km de distancia\n💰 $70,000 - $90,000/año\n⭐ Match: 88%\n\nEstos trabajos coinciden con tus habilidades en React, TypeScript y diseño. ¿Quieres que te ayude a preparar tu postulación?"
    }

    if (lowerInput.includes("mensaje") || lowerInput.includes("escribir") || lowerInput.includes("contactar")) {
      return "Aquí tienes una plantilla profesional:\n\nHola [Nombre],\n\nVi tu publicación de [Puesto] y me interesa mucho la oportunidad. Con [X años] de experiencia en [área], creo que puedo aportar valor a tu equipo.\n\nMe gustaría conocer más detalles sobre el proyecto y cómo puedo contribuir.\n\n¿Tienes disponibilidad para una breve llamada esta semana?\n\nSaludos,\n[Tu nombre]\n\n¿Quieres que personalice este mensaje?"
    }

    if (lowerInput.includes("salario") || lowerInput.includes("sueldo") || lowerInput.includes("pagar")) {
      return "Basado en tu perfil y ubicación, el rango salarial estimado es:\n\n💵 Junior: $40,000 - $60,000/año\n💵 Semi-Senior: $60,000 - $90,000/año\n💵 Senior: $90,000 - $140,000/año\n\nEsto varía según la industria y habilidades específicas. Tu perfil actual está en el rango semi-senior. ¿Quieres consejos para llegar al siguiente nivel?"
    }

    return "Entiendo tu consulta. Puedo ayudarte con:\n\n✨ Optimizar tu perfil profesional\n🔍 Encontrar trabajos relevantes\n📝 Redactar mensajes y aplicaciones\n💡 Consejos de carrera\n💰 Estimaciones salariales\n📊 Análisis de mercado\n\n¿En qué área específica necesitas ayuda?"
  }

  const quickActions = [
    { icon: Sparkles, label: "Mejorar perfil", prompt: "¿Cómo puedo mejorar mi perfil?" },
    { icon: Briefcase, label: "Buscar trabajo", prompt: "Ayúdame a encontrar trabajo relevante" },
    { icon: FileText, label: "Redactar mensaje", prompt: "Necesito ayuda para escribir un mensaje profesional" },
    { icon: Lightbulb, label: "Consejos", prompt: "Dame consejos para mi carrera" },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-bounce hover:animate-none transition-all duration-300 hover:scale-110"
      >
        <Bot className="h-6 w-6" />
        <span className="sr-only">Abrir asistente IA</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">Asistente IA</h3>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>En línea</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3 whitespace-pre-wrap",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Escribiendo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Acciones rápidas:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 flex flex-col items-center gap-1 bg-transparent"
                onClick={() => {
                  setInput(action.prompt)
                  handleSend()
                }}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Escribe tu mensaje..."
            className="min-h-[60px] resize-none"
          />
          <Button onClick={handleSend} size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Presiona Enter para enviar, Shift+Enter para nueva línea</p>
      </div>
    </Card>
  )
}

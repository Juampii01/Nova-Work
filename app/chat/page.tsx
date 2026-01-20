"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Crown,
  Paperclip,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Maximize2,
  ImageIcon,
  Download,
  Play,
  FileText,
} from "lucide-react"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState("1")
  const [message, setMessage] = useState("")
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [isAudioCall, setIsAudioCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const chats = [
    {
      id: "1",
      name: "TechStart Buenos Aires",
      lastMessage: "¿Cuándo podrías empezar?",
      time: "10:30",
      unread: 2,
      online: true,
      avatar: "T",
      type: "employer",
      verified: true,
    },
    {
      id: "2",
      name: "Miguel Rodríguez",
      lastMessage: "Perfecto, nos vemos mañana",
      time: "09:15",
      unread: 0,
      online: false,
      avatar: "M",
      type: "candidate",
      verified: true,
    },
    {
      id: "3",
      name: "Mueblería San Telmo",
      lastMessage: "Enviame tu portfolio por favor",
      time: "Ayer",
      unread: 1,
      online: true,
      avatar: "S",
      type: "employer",
      verified: false,
    },
  ]

  const messages = [
    {
      id: "1",
      sender: "them",
      content: "Hola! Vi tu perfil y me interesa tu experiencia en React",
      time: "10:25",
      type: "text",
    },
    {
      id: "2",
      sender: "me",
      content: "¡Hola! Gracias por contactarme. Me encantaría saber más sobre la posición",
      time: "10:27",
      type: "text",
    },
    {
      id: "3",
      sender: "them",
      content: "Es para un proyecto de e-commerce, trabajo híbrido en Palermo. ¿Cuándo podrías empezar?",
      time: "10:30",
      type: "text",
    },
    {
      id: "4",
      sender: "me",
      content: "portfolio-2024.pdf",
      time: "10:32",
      type: "file",
      fileSize: "2.4 MB",
    },
    {
      id: "5",
      sender: "them",
      content: "",
      time: "10:35",
      type: "voice",
      duration: "0:45",
    },
    {
      id: "6",
      sender: "me",
      content: "proyecto-screenshot.png",
      time: "10:38",
      type: "image",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const startVideoCall = () => {
    setIsVideoCall(true)
    setIsAudioCall(false)
  }

  const startAudioCall = () => {
    setIsAudioCall(true)
    setIsVideoCall(false)
  }

  const endCall = () => {
    setIsVideoCall(false)
    setIsAudioCall(false)
    setIsMuted(false)
    setIsVideoEnabled(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setIsRecording(false)
      setRecordingTime(0)
    }, 5000) // Auto stop after 5 seconds for demo
  }

  const stopRecording = () => {
    setIsRecording(false)
    setRecordingTime(0)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  const VideoCallOverlay = () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-3xl bg-gray-900 rounded-lg overflow-hidden">
        {/* Remote video */}
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-accent">{selectedChatData?.avatar}</span>
            </div>
            <h3 className="text-xl font-semibold">{selectedChatData?.name}</h3>
            <p className="text-gray-400">Conectando...</p>
          </div>
        </div>

        {/* Local video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-white">Tu video</span>
          </div>
        </div>

        {/* Call controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-14 h-14"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {isVideoCall && (
            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-14 h-14"
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          )}

          <Button variant="destructive" size="lg" onClick={endCall} className="rounded-full w-14 h-14">
            <PhoneOff className="w-6 h-6" />
          </Button>

          <Button variant="secondary" size="lg" className="rounded-full w-14 h-14">
            <Maximize2 className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
          {/* Chat List */}
          <Card className="lg:col-span-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Mensajes</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {chats.filter((chat) => chat.unread > 0).length}
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar conversaciones..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedChat === chat.id ? "bg-accent/10 border-r-2 border-accent" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-accent">{chat.avatar}</span>
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <p className="font-medium truncate">{chat.name}</p>
                            {chat.verified && (
                              <Badge variant="secondary" className="w-4 h-4 p-0 bg-blue-100 text-blue-600">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {chat.type === "employer" && <Crown className="w-3 h-3 text-accent" />}
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <Badge className="w-5 h-5 p-0 flex items-center justify-center text-xs bg-accent">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-3 flex flex-col overflow-hidden">
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-accent">{selectedChatData.avatar}</span>
                        </div>
                        {selectedChatData.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{selectedChatData.name}</h3>
                          {selectedChatData.type === "employer" && <Crown className="w-4 h-4 text-accent" />}
                          {selectedChatData.verified && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedChatData.online ? "En línea" : "Última vez hace 2 horas"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={startAudioCall}>
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={startVideoCall}>
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === "me" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {msg.type === "text" && <p className="text-sm">{msg.content}</p>}

                          {msg.type === "file" && (
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{msg.content}</p>
                                <p className="text-xs opacity-70">{msg.fileSize}</p>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          )}

                          {msg.type === "voice" && (
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Play className="w-3 h-3" />
                              </Button>
                              <div className="flex-1 h-1 bg-white/20 rounded-full">
                                <div className="w-1/3 h-full bg-white rounded-full"></div>
                              </div>
                              <span className="text-xs">{msg.duration}</span>
                            </div>
                          )}

                          {msg.type === "image" && (
                            <div className="space-y-2">
                              <div className="w-48 h-32 bg-white/10 rounded flex items-center justify-center">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                              <p className="text-xs">{msg.content}</p>
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <Separator />

                {/* Message Input */}
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                      <Paperclip className="w-4 h-4" />
                    </Button>

                    <Input
                      placeholder="Escribí tu mensaje..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />

                    {message.trim() ? (
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant={isRecording ? "destructive" : "ghost"}
                        size="sm"
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        <Mic className="w-4 h-4" />
                        {isRecording && <span className="ml-1 text-xs">{recordingTime}s</span>}
                      </Button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        console.log("File selected:", file.name)
                      }
                    }}
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    Presioná Enter para enviar • Sé respetuoso y profesional
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Seleccioná una conversación</h3>
                    <p className="text-muted-foreground">Elegí un chat de la lista para empezar a conversar</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Free Plan Limitation */}
        <Card className="mt-4 border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Plan Free: 3 de 5 chats usados este mes</p>
                  <p className="text-sm text-muted-foreground">
                    Actualizá a Pro para chats ilimitados, videollamadas y funciones premium
                  </p>
                </div>
              </div>
              <Button size="sm" className="flex-shrink-0">
                <Crown className="w-4 h-4 mr-2" />
                Actualizar a Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />

      {(isVideoCall || isAudioCall) && <VideoCallOverlay />}
    </div>
  )
}

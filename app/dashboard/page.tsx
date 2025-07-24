"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Calendar, Users, Send, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("messages")
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (!user || user.role !== "user") {
      router.push("/")
      return
    }
    setCurrentUser(user)
    loadUsers()
    loadMessages()
    loadNotices()
  }, [router])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(storedUsers)
  }

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]")
    setMessages(storedMessages)
  }

  const loadNotices = () => {
    const storedNotices = JSON.parse(localStorage.getItem("notices") || "[]")
    setNotices(storedNotices)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    const message = {
      id: Date.now().toString(),
      from: currentUser.username,
      to: selectedUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    const existingMessages = JSON.parse(localStorage.getItem("messages") || "[]")
    const updatedMessages = [...existingMessages, message]
    localStorage.setItem("messages", JSON.stringify(updatedMessages))
    setMessages(updatedMessages)
    setNewMessage("")
  }

  const getConversation = (username: string) => {
    return messages
      .filter(
        (msg) =>
          (msg.from === currentUser.username && msg.to === username) ||
          (msg.from === username && msg.to === currentUser.username),
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">Gov-messaging</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">Welcome, {currentUser.fullName || currentUser.username}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-8">
            <TabsTrigger value="messages" className="data-[state=active]:bg-amber-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Agency Communication
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-amber-600">
              <Calendar className="h-4 w-4 mr-2" />
              Public Notices & Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Users List */}
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {users
                        .filter((u) => u.username !== currentUser.username)
                        .map((user) => (
                          <div
                            key={user.username}
                            onClick={() => setSelectedUser(user.username)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedUser === user.username
                                ? "bg-amber-600/30 border border-amber-500/50"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <p className="text-white font-medium">{user.fullName}</p>
                            <p className="text-white/60 text-sm">@{user.username}</p>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-md bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {selectedUser
                        ? `Chat with ${users.find((u) => u.username === selectedUser)?.fullName || selectedUser}`
                        : "Select a user to start chatting"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedUser ? (
                      <>
                        <ScrollArea className="h-[300px] p-4 bg-white/5 rounded-lg">
                          <div className="space-y-4">
                            {getConversation(selectedUser).map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.from === currentUser.username ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    message.from === currentUser.username
                                      ? "bg-amber-600 text-white"
                                      : "bg-white/10 text-white"
                                  }`}
                                >
                                  <p>{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="bg-white/10 border-white/20 text-white flex-1"
                          />
                          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="h-[350px] flex items-center justify-center text-white/60">
                        Select a user from the list to start messaging
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Notice Board</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notices.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No notices available</p>
                ) : (
                  <div className="space-y-4">
                    {notices
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((notice) => (
                        <div key={notice.id} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium text-lg">{notice.title}</h4>
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 mt-1">
                                {formatDate(notice.date)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/80 mt-3">{notice.content}</p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

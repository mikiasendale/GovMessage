"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Calendar, MessageSquare, LogOut, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  })
  const [newNotice, setNewNotice] = useState({
    date: "",
    title: "",
    content: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    setCurrentUser(user)
    loadUsers()
    loadNotices()
    loadFeedbacks()
  }, [router])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(storedUsers)
  }

  const loadNotices = () => {
    const storedNotices = JSON.parse(localStorage.getItem("notices") || "[]")
    setNotices(storedNotices)
  }

  const loadFeedbacks = () => {
    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")
    setFeedbacks(storedFeedbacks)
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    if (existingUsers.some((u: any) => u.username === newUser.username)) {
      setError("Username already exists")
      return
    }

    const userToAdd = {
      ...newUser,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...existingUsers, userToAdd]
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setNewUser({ username: "", password: "", email: "", fullName: "" })
    setIsAddUserOpen(false)
    setError("")
  }

  const handleDeleteUser = (username: string) => {
    const updatedUsers = users.filter((u) => u.username !== username)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault()

    const notice = {
      id: Date.now().toString(),
      ...newNotice,
      createdAt: new Date().toISOString(),
    }

    const existingNotices = JSON.parse(localStorage.getItem("notices") || "[]")
    const updatedNotices = [...existingNotices, notice]
    localStorage.setItem("notices", JSON.stringify(updatedNotices))
    setNotices(updatedNotices)
    setNewNotice({ date: "", title: "", content: "" })
    setIsAddNoticeOpen(false)
  }

  const handleDeleteNotice = (id: string) => {
    const updatedNotices = notices.filter((n) => n.id !== id)
    localStorage.setItem("notices", JSON.stringify(updatedNotices))
    setNotices(updatedNotices)
  }

  const handleMarkFeedbackAsRead = (id: string) => {
    const updatedFeedbacks = feedbacks.map((f) => (f.id === id ? { ...f, status: "read" } : f))
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks))
    setFeedbacks(updatedFeedbacks)
  }

  const handleDeleteFeedback = (id: string) => {
    const updatedFeedbacks = feedbacks.filter((f) => f.id !== id)
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks))
    setFeedbacks(updatedFeedbacks)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
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
            <span className="text-xl font-bold text-white">Government Admin Portal</span>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Management */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-md bg-slate-900/95 border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      {error && (
                        <Alert className="bg-red-500/20 border-red-500/50">
                          <AlertDescription className="text-red-200">{error}</AlertDescription>
                        </Alert>
                      )}
                      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                        Add User
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px]">
                {users.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No users registered yet</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-2"
                    >
                      <div>
                        <p className="text-white font-medium">{user.fullName}</p>
                        <p className="text-white/60 text-sm">@{user.username}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
                          {user.role}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.username)}
                          className="bg-red-500/20 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Notice Management */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Notice Management</span>
                </div>
                <Dialog open={isAddNoticeOpen} onOpenChange={setIsAddNoticeOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Notice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-md bg-slate-900/95 border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Notice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddNotice} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newNotice.date}
                          onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newNotice.content}
                          onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                          className="bg-white/10 border-white/20 text-white min-h-[100px]"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                        Add Notice
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px]">
                {notices.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No notices created yet</p>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className="p-4 bg-white/5 rounded-lg mb-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{notice.title}</h4>
                          <p className="text-white/60 text-sm">{notice.date}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="bg-red-500/20 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-white/80 text-sm">{notice.content}</p>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Citizen Feedback Management */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Citizen Feedback</span>
                {feedbacks.filter((f) => f.status === "unread").length > 0 && (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    {feedbacks.filter((f) => f.status === "unread").length} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px]">
                {feedbacks.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No feedback received yet</p>
                ) : (
                  feedbacks
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((feedback) => (
                      <div
                        key={feedback.id}
                        className={`p-4 rounded-lg mb-2 ${
                          feedback.status === "unread" ? "bg-amber-500/10 border border-amber-500/30" : "bg-white/5"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-white font-medium">{feedback.name}</h4>
                              <Badge
                                variant="secondary"
                                className={
                                  feedback.status === "unread"
                                    ? "bg-red-500/20 text-red-300"
                                    : "bg-green-500/20 text-green-300"
                                }
                              >
                                {feedback.status}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm">{feedback.email}</p>
                            <p className="text-white/60 text-xs">
                              {new Date(feedback.timestamp).toLocaleDateString()} at{" "}
                              {new Date(feedback.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            {feedback.status === "unread" && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkFeedbackAsRead(feedback.id)}
                                className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="bg-red-500/20 hover:bg-red-500/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mt-2">{feedback.message}</p>
                      </div>
                    ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-white/60">Total Users</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{notices.length}</p>
              <p className="text-white/60">Active Notices</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{feedbacks.length}</p>
              <p className="text-white/60">Total Feedback</p>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="h-8 w-8 bg-amber-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">
                  {feedbacks.filter((f) => f.status === "unread").length}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{feedbacks.filter((f) => f.status === "unread").length}</p>
              <p className="text-white/60">Unread Feedback</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

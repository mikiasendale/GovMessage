"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: any) => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
  })
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check for admin login
    if (loginForm.username === "admin" && loginForm.password === "admin") {
      const adminUser = { username: "admin", role: "admin", fullName: "Administrator" }
      localStorage.setItem("currentUser", JSON.stringify(adminUser))
      onLoginSuccess(adminUser)
      onClose()
      return
    }

    // Check for regular user login
    const user = users.find((u: any) => u.username === loginForm.username && u.password === loginForm.password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      onLoginSuccess(user)
      onClose()
    } else {
      setError("Invalid username or password")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if username already exists
    if (users.some((u: any) => u.username === registerForm.username)) {
      setError("Username already exists")
      return
    }

    // Add new user
    const newUser = {
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      fullName: registerForm.fullName,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Auto login after registration
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    onLoginSuccess(newUser)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-md bg-slate-900/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome to Gov-messaging</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="login" className="data-[state=active]:bg-amber-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-amber-600">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
                Login
              </Button>
            </form>
            <div className="text-center text-sm text-white/60">
              <p>Admin credentials: username: admin, password: admin</p>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <ScrollArea>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regUsername">Username</Label>
                  <Input
                    id="regUsername"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
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
                  Register
                </Button>
              </form>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

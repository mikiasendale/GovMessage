"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Calendar, Shield, ArrowRight, Star, Zap, Globe } from "lucide-react"
import LoginModal from "@/components/login-modal"
import { useRouter } from "next/navigation"

const slides = [
  {
    title: "Citizen Feedback",
    description: "Secure channel for citizens to communicate with government agencies",
    icon: MessageCircle,
    gradient: "from-blue-500/20 to-amber-500/20",
  },
  {
    title: "Agency Coordination",
    description: "Streamline communication between government departments",
    icon: Users,
    gradient: "from-green-500/20 to-blue-500/20",
  },
  {
    title: "Public Notices",
    description: "Share important announcements and updates with citizens",
    icon: Calendar,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Secure Platform",
    description: "Government-grade security for all communications",
    icon: Shield,
    gradient: "from-blue-500/20 to-green-500/20",
  },
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store feedback in localStorage
    const feedback = {
      id: Date.now().toString(),
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      timestamp: new Date().toISOString(),
      status: "unread",
    }

    const existingFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")
    const updatedFeedbacks = [...existingFeedbacks, feedback]
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks))

    alert("Thank you for your feedback! We'll get back to you soon.")
    setContactForm({ name: "", email: "", message: "" })
  }

  const handleLoginSuccess = (user: any) => {
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">Gov-messaging</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </a>
            <Button onClick={() => setIsLoginOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  Government Communication Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Connect Citizens & Government
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                    {" "}
                    Seamlessly
                  </span>
                </h1>
                <p className="text-xl text-white/70 leading-relaxed">
                  A secure government messaging platform designed for citizen feedback, inter-agency communication, and
                  transparent public service delivery.
                </p>
              </div>

              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Submit Your Feedback</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                    <Textarea
                      placeholder="Your Message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
                    >
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Glassmorphic Slides */}
            <div className="relative h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {slides.map((slide, index) => {
                  const Icon = slide.icon
                  return (
                    <Card
                      key={index}
                      className={`absolute inset-0 backdrop-blur-md bg-gradient-to-br ${slide.gradient} border-white/20 transition-all duration-1000 transform ${
                        index === currentSlide
                          ? "opacity-100 translate-x-0 scale-100"
                          : index < currentSlide
                            ? "opacity-0 -translate-x-full scale-95"
                            : "opacity-0 translate-x-full scale-95"
                      }`}
                    >
                      <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center space-y-6">
                        <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                          <Icon className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                        <p className="text-white/80 text-lg leading-relaxed">{slide.description}</p>
                        <div className="flex space-x-2">
                          {slides.map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full transition-all ${
                                i === currentSlide ? "bg-white" : "bg-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Why Choose Gov-messaging?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built for government agencies and citizens who need reliable, secure, and efficient communication tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Government Grade Security",
                description: "Military-level encryption and security protocols for sensitive communications.",
              },
              {
                icon: Zap,
                title: "Instant Response",
                description: "Real-time messaging ensures quick response to citizen inquiries and agency coordination.",
              },
              {
                icon: Globe,
                title: "Public Transparency",
                description: "Promote open government through transparent communication channels.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="p-3 rounded-full bg-amber-500/20 w-fit mx-auto">
                      <Icon className="h-8 w-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageCircle className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-semibold text-white">Gov-messaging</span>
          </div>
          <p className="text-white/60">© 2025 Gov-messaging. All rights reserved.</p>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}

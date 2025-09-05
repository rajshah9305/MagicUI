'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '../components/ui/header'
import { AgentDashboard } from '../components/ui/agent-dashboard'
import { HolographicPreview } from '../components/ui/holographic-preview'
import { IntelligenceMetrics } from '../components/ui/intelligence-metrics'
import { ChatInterface } from '../components/ui/chat-interface'
import { useMagicUI } from '../lib/hooks'
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Layers, 
  Palette, 
  Code, 
  Eye, 
  Shield,
  Rocket,
  Command,
  Play,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const { 
    agents, 
    messages, 
    generatedUI, 
    isLoading, 
    handleSendMessage 
  } = useMagicUI()
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    // Auto-hide welcome screen after user interaction or 10 seconds
    const timer = setTimeout(() => {
      if (messages.length <= 1) {
        setShowWelcome(false)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => {
    if (messages.length > 1) {
      setShowWelcome(false)
    }
  }, [messages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleDownload = () => {
    if (generatedUI) {
      const blob = new Blob([generatedUI.code], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-component.tsx'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleGetStarted = () => {
    setShowWelcome(false)
    // Auto-focus chat input
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder*="Describe the UI"]') as HTMLInputElement
      chatInput?.focus()
    }, 500)
  }

  const features = [
    {
      icon: Brain,
      title: "Neural AI Orchestration",
      description: "6 specialized AI agents working in perfect harmony",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Layers,
      title: "Holographic Previews",
      description: "Multi-dimensional UI visualization with real-time rendering",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "From concept to code in seconds, not hours",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description: "Production-grade code with built-in security",
      gradient: "from-green-500 to-emerald-600"
    }
  ]

  if (showWelcome) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 premium-holographic opacity-20" />
        <div className="absolute inset-0 premium-mesh opacity-30" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-xl animate-premium-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-xl animate-premium-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-premium-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">Magic UI Studio Pro v2.0</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  Create Elite UI
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
                  With AI Power
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
                Transform your ideas into stunning user interfaces through our revolutionary 
                AI orchestration platform. Experience the future of design automation.
              </p>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="premium-card p-6 text-center hover-lift-premium h-full">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Creating Magic
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.button>
              
              <motion.button
                onClick={() => setCommandPaletteOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
              >
                <Command className="w-5 h-5" />
                Quick Command
                <span className="text-sm opacity-70">⌘K</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: "10K+", label: "UIs Generated" },
                { value: "99.9%", label: "Uptime" },
                { value: "< 3s", label: "Generation Time" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Command Palette Overlay */}
        <AnimatePresence>
          {commandPaletteOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32"
              onClick={() => setCommandPaletteOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="premium-card w-full max-w-2xl mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Command className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Create Login Page", action: () => handleSendMessage("Create a modern login page") },
                    { label: "Build Dashboard", action: () => handleSendMessage("Design a dashboard layout") },
                    { label: "Generate Contact Form", action: () => handleSendMessage("Build a contact form") },
                    { label: "Make Hero Section", action: () => handleSendMessage("Create a hero section") }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action()
                        setCommandPaletteOpen(false)
                        handleGetStarted()
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 premium-mesh opacity-20" />
      
      <Header 
        onDownload={handleDownload}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isFullscreen={isFullscreen}
        hasGeneratedUI={!!generatedUI}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[calc(100vh-200px)]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-4 h-full overflow-hidden"
          >
            <div className="h-1/2 overflow-y-auto">
              <AgentDashboard agents={agents} />
            </div>
            
            <div className="h-1/2">
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-4 h-full overflow-hidden"
          >
            <div className="h-2/3">
              <HolographicPreview
                previewHtml={generatedUI?.preview}
                code={generatedUI?.code}
                onDownload={handleDownload}
              />
            </div>

            {generatedUI?.metrics && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="h-1/3 overflow-y-auto"
              >
                <IntelligenceMetrics
                  metrics={generatedUI.metrics}
                  recommendations={[
                    "Consider adding more interactive elements to improve user engagement",
                    "The color contrast could be enhanced for better accessibility",
                    "Adding micro-animations would make the interface more polished"
                  ]}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Command Palette for main interface */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="premium-card w-full max-w-2xl mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Command className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Create Login Page", action: () => handleSendMessage("Create a modern login page") },
                  { label: "Build Dashboard", action: () => handleSendMessage("Design a dashboard layout") },
                  { label: "Generate Contact Form", action: () => handleSendMessage("Build a contact form") },
                  { label: "Make Hero Section", action: () => handleSendMessage("Create a hero section") },
                  { label: "Design Pricing Table", action: () => handleSendMessage("Generate a pricing table") },
                  { label: "Create Navigation Bar", action: () => handleSendMessage("Build a navigation header") }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setCommandPaletteOpen(false)
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
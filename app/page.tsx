'use client'

import { useState, useEffect } from 'react'
import { PremiumHeaderV2 } from '../components/elite-ui/premium-header-v2'
import { PremiumAgentDashboard } from '../components/elite-ui/premium-agent-dashboard'
import { PremiumHolographicPreview } from '../components/elite-ui/premium-holographic-preview'
import { PremiumIntelligenceMetrics } from '../components/elite-ui/premium-intelligence-metrics'
import { PremiumChatInterface } from '../components/elite-ui/premium-chat-interface'
import { Agent, ChatMessage, GeneratedUI } from '../src/shared/types'

export default function Home() {
  const [agents, setAgents] = useState<Record<string, any>>({
    architect: {
      name: 'Design Architect',
      specialization: ['ui_design', 'user_experience'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to analyze requirements',
      performance: {
        successRate: 0.95,
        qualityScore: 0.92,
        avgDuration: 2500
      }
    },
    style_curator: {
      name: 'Style Curator',
      specialization: ['visual_design', 'branding'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to apply styling',
      performance: {
        successRate: 0.88,
        qualityScore: 0.89,
        avgDuration: 1800
      }
    },
    code_generator: {
      name: 'Code Generator',
      specialization: ['react', 'typescript'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to generate code',
      performance: {
        successRate: 0.93,
        qualityScore: 0.91,
        avgDuration: 3200
      }
    },
    previewer: {
      name: 'Preview Engine',
      specialization: ['visualization', 'testing'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to render preview',
      performance: {
        successRate: 0.97,
        qualityScore: 0.94,
        avgDuration: 1200
      }
    },
    qa_engineer: {
      name: 'QA Engineer',
      specialization: ['quality_assurance', 'testing'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to validate output',
      performance: {
        successRate: 0.96,
        qualityScore: 0.93,
        avgDuration: 2100
      }
    },
    exporter: {
      name: 'Export Manager',
      specialization: ['deployment', 'optimization'],
      status: 'idle',
      progress: 0,
      currentTask: 'Ready to export code',
      performance: {
        successRate: 0.99,
        qualityScore: 0.95,
        avgDuration: 800
      }
    }
  })
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  
  // Initialize messages on client side to avoid hydration mismatch
  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: 'Welcome to Magic UI Studio Pro! Describe the UI you want to create and I\'ll orchestrate our AI agents to build it for you.',
        timestamp: new Date(),
      }
    ])
  }, [])
  
  const [generatedUI, setGeneratedUI] = useState<GeneratedUI>()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [workflowStep, setWorkflowStep] = useState(0)

  const generateAdvancedUI = (message: string) => {
    const uiTemplates = {
      login: {
        code: `import { useState } from 'react'\nimport { Button } from '@/components/ui/button'\nimport { Input } from '@/components/ui/input'\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\n\nexport default function LoginPage() {\n  const [email, setEmail] = useState('')\n  const [password, setPassword] = useState('')\n\n  return (\n    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">\n      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">\n        <CardHeader className="text-center pb-2">\n          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">\n            Welcome Back\n          </CardTitle>\n          <p className="text-gray-600 mt-2">Sign in to your account</p>\n        </CardHeader>\n        <CardContent className="space-y-4">\n          <div className="space-y-2">\n            <Input\n              type="email"\n              placeholder="Email address"\n              value={email}\n              onChange={(e) => setEmail(e.target.value)}\n              className="h-12"\n            />\n          </div>\n          <div className="space-y-2">\n            <Input\n              type="password"\n              placeholder="Password"\n              value={password}\n              onChange={(e) => setPassword(e.target.value)}\n              className="h-12"\n            />\n          </div>\n          <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">\n            Sign In\n          </Button>\n          <div className="text-center">\n            <a href="#" className="text-sm text-blue-600 hover:underline">\n              Forgot your password?\n            </a>\n          </div>\n        </CardContent>\n      </Card>\n    </div>\n  )\n}`,
        preview: `<!DOCTYPE html>\n<html>\n<head>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <style>\n    .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }\n  </style>\n</head>\n<body>\n  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">\n    <div class="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/20">\n      <div class="text-center mb-8">\n        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">\n          Welcome Back\n        </h1>\n        <p class="text-gray-600">Sign in to your account</p>\n      </div>\n      <form class="space-y-6">\n        <div>\n          <input type="email" placeholder="Email address" class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">\n        </div>\n        <div>\n          <input type="password" placeholder="Password" class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">\n        </div>\n        <button type="submit" class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">\n          Sign In\n        </button>\n        <div class="text-center">\n          <a href="#" class="text-sm text-blue-600 hover:underline">Forgot your password?</a>\n        </div>\n      </form>\n    </div>\n  </div>\n</body>\n</html>`
      },
      dashboard: {
        code: `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\nimport { Button } from '@/components/ui/button'\nimport { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react'\n\nexport default function Dashboard() {\n  const stats = [\n    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign },\n    { title: 'Active Users', value: '2,350', change: '+15.3%', icon: Users },\n    { title: 'Growth Rate', value: '12.5%', change: '+2.4%', icon: TrendingUp },\n    { title: 'Conversion', value: '3.2%', change: '+0.8%', icon: BarChart3 }\n  ]\n\n  return (\n    <div className="min-h-screen bg-gray-50 p-6">\n      <div className="max-w-7xl mx-auto">\n        <div className="mb-8">\n          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>\n          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>\n        </div>\n        \n        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\n          {stats.map((stat, index) => (\n            <Card key={index} className="hover:shadow-lg transition-shadow">\n              <CardContent className="p-6">\n                <div className="flex items-center justify-between">\n                  <div>\n                    <p className="text-sm text-gray-600">{stat.title}</p>\n                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>\n                    <p className="text-sm text-green-600">{stat.change}</p>\n                  </div>\n                  <stat.icon className="h-8 w-8 text-blue-600" />\n                </div>\n              </CardContent>\n            </Card>\n          ))}\n        </div>\n      </div>\n    </div>\n  )\n}`,
        preview: `<!DOCTYPE html>\n<html>\n<head>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body>\n  <div class="min-h-screen bg-gray-50 p-6">\n    <div class="max-w-7xl mx-auto">\n      <div class="mb-8">\n        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>\n        <p class="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>\n      </div>\n      \n      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\n          <div class="flex items-center justify-between">\n            <div>\n              <p class="text-sm text-gray-600">Total Revenue</p>\n              <p class="text-2xl font-bold text-gray-900">$45,231</p>\n              <p class="text-sm text-green-600">+20.1%</p>\n            </div>\n            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">\n              <span class="text-blue-600">$</span>\n            </div>\n          </div>\n        </div>\n        \n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\n          <div class="flex items-center justify-between">\n            <div>\n              <p class="text-sm text-gray-600">Active Users</p>\n              <p class="text-2xl font-bold text-gray-900">2,350</p>\n              <p class="text-sm text-green-600">+15.3%</p>\n            </div>\n            <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">\n              <span class="text-green-600">👥</span>\n            </div>\n          </div>\n        </div>\n        \n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\n          <div class="flex items-center justify-between">\n            <div>\n              <p class="text-sm text-gray-600">Growth Rate</p>\n              <p class="text-2xl font-bold text-gray-900">12.5%</p>\n              <p class="text-sm text-green-600">+2.4%</p>\n            </div>\n            <div class="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">\n              <span class="text-purple-600">📈</span>\n            </div>\n          </div>\n        </div>\n        \n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\n          <div class="flex items-center justify-between">\n            <div>\n              <p class="text-sm text-gray-600">Conversion</p>\n              <p class="text-2xl font-bold text-gray-900">3.2%</p>\n              <p class="text-sm text-green-600">+0.8%</p>\n            </div>\n            <div class="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">\n              <span class="text-orange-600">📊</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</body>\n</html>`
      }
    }

    const template = message.toLowerCase().includes('login') ? uiTemplates.login : 
                    message.toLowerCase().includes('dashboard') ? uiTemplates.dashboard :
                    uiTemplates.login // default

    return {
      id: Date.now().toString(),
      requestId: Date.now().toString(),
      code: template.code,
      preview: template.preview,
      components: [],
      metrics: {
        novelty: Math.random() * 0.3 + 0.7,
        quality: Math.random() * 0.2 + 0.8,
        performance: Math.random() * 0.25 + 0.75,
        accessibility: Math.random() * 0.15 + 0.85
      }
    }
  }

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setWorkflowStep(0)

    // Enhanced agent workflow simulation
    const workflowSteps = [
      'Analyzing requirements...',
      'Designing architecture...',
      'Generating components...',
      'Applying styles...',
      'Optimizing code...',
      'Running quality checks...'
    ]

    const agentIds = Object.keys(agents)
    
    // Reset all agents to working state
    setAgents(prev => {
      const updated = { ...prev }
      agentIds.forEach(agentId => {
        updated[agentId] = {
          ...updated[agentId],
          status: 'working',
          progress: 0,
          currentTask: 'Initializing...'
        }
      })
      return updated
    })
    
    // Simulate sequential workflow
    for (let i = 0; i < agentIds.length; i++) {
      const agentId = agentIds[i]
      
      // Start working
      setTimeout(() => {
        setWorkflowStep(i + 1)
        setAgents(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            status: 'working',
            progress: 25,
            currentTask: workflowSteps[i] || 'Processing...'
          }
        }))
      }, i * 1000)
      
      // Progress update
      setTimeout(() => {
        setAgents(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            progress: 75,
            currentTask: workflowSteps[i] || 'Processing...'
          }
        }))
      }, (i * 1000) + 500)
      
      // Complete
      setTimeout(() => {
        setAgents(prev => ({
          ...prev,
          [agentId]: {
            ...prev[agentId],
            status: 'completed',
            progress: 100,
            currentTask: 'Task completed successfully'
          }
        }))
      }, (i + 1) * 1000)
    }

    // Generate UI with enhanced templates
    setTimeout(() => {
      const mockUI = generateAdvancedUI(message)
      setGeneratedUI(mockUI)
      setIsLoading(false)
      setActiveTab('preview')
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `✨ Perfect! I've generated a ${message.toLowerCase().includes('login') ? 'login page' : message.toLowerCase().includes('dashboard') ? 'dashboard' : 'component'} based on your request. The design features modern styling, responsive layout, and excellent accessibility scores. You can preview it in the main panel and download the production-ready code.`,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    }, 4000)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <PremiumHeaderV2 
        onDownload={handleDownload}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isFullscreen={isFullscreen}
        hasGeneratedUI={!!generatedUI}
      />

      {/* Main Content - Optimized Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Single Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Agents & Chat */}
          <div className="lg:col-span-4 space-y-4 h-full overflow-hidden">
            {/* Agent Dashboard - Compact */}
            <div className="h-1/2 overflow-y-auto">
              <PremiumAgentDashboard agents={agents} />
            </div>
            
            {/* Chat Interface - Compact */}
            <div className="h-1/2">
              <PremiumChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Main Content - Preview & Metrics */}
          <div className="lg:col-span-8 space-y-4 h-full overflow-hidden">
            {/* Holographic Preview - Main Focus */}
            <div className="h-2/3">
              <PremiumHolographicPreview
                previewHtml={generatedUI?.preview}
                code={generatedUI?.code}
                onDownload={handleDownload}
              />
            </div>

            {/* Intelligence Metrics - Compact */}
            {generatedUI?.metrics && (
              <div className="h-1/3 overflow-y-auto">
                <PremiumIntelligenceMetrics
                  metrics={generatedUI.metrics}
                  recommendations={[
                    "Consider adding more interactive elements to improve user engagement",
                    "The color contrast could be enhanced for better accessibility",
                    "Adding micro-animations would make the interface more polished"
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
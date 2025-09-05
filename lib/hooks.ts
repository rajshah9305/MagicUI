'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Agent, ChatMessage, GeneratedUI, AgentStatus } from './types'
import { apiClient, createWebSocketClient, generateClientId } from './api'

// Initialize client ID
const clientId = generateClientId()

// Mock data and templates can be moved to a separate file (e.g., lib/data.ts)
const initialAgents: Record<string, Agent> = {
  architect: {
    name: 'Design Architect',
    specialization: ['ui_design', 'user_experience'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to analyze requirements',
    performance: { successRate: 0.95, qualityScore: 0.92, avgDuration: 2500 }
  },
  style_curator: {
    name: 'Style Curator',
    specialization: ['visual_design', 'branding'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to apply styling',
    performance: { successRate: 0.88, qualityScore: 0.89, avgDuration: 1800 }
  },
  code_generator: {
    name: 'Code Generator',
    specialization: ['react', 'typescript'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to generate code',
    performance: { successRate: 0.93, qualityScore: 0.91, avgDuration: 3200 }
  },
  previewer: {
    name: 'Preview Engine',
    specialization: ['visualization', 'testing'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to render preview',
    performance: { successRate: 0.97, qualityScore: 0.94, avgDuration: 1200 }
  },
  qa_engineer: {
    name: 'QA Engineer',
    specialization: ['quality_assurance', 'testing'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to validate output',
    performance: { successRate: 0.96, qualityScore: 0.93, avgDuration: 2100 }
  },
  exporter: {
    name: 'Export Manager',
    specialization: ['deployment', 'optimization'],
    status: AgentStatus.IDLE,
    progress: 0,
    currentTask: 'Ready to export code',
    performance: { successRate: 0.99, qualityScore: 0.95, avgDuration: 800 }
  }
};

// UI Templates for fallback generation
const uiTemplates = {
    login: {
      code: `import { useState } from 'react'\\nimport { Button } from '@/components/ui/button'\\nimport { Input } from '@/components/ui/input'\\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\\n\\nexport default function LoginPage() {\\n  const [email, setEmail] = useState('')\\n  const [password, setPassword] = useState('')\\n\\n  return (\\n    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">\\n      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">\\n        <CardHeader className="text-center pb-2">\\n          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">\\n            Welcome Back\\n          </CardTitle>\\n          <p className="text-gray-600 mt-2">Sign in to your account</p>\\n        </CardHeader>\\n        <CardContent className="space-y-4">\\n          <div className="space-y-2">\\n            <Input\\n              type="email"\\n              placeholder="Email address"\\n              value={email}\\n              onChange={(e) => setEmail(e.target.value)}\\n              className="h-12"\\n            />\\n          </div>\\n          <div className="space-y-2">\\n            <Input\\n              type="password"\\n              placeholder="Password"\\n              value={password}\\n              onChange={(e) => setPassword(e.target.value)}\\n              className="h-12"\\n            />\\n          </div>\\n          <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">\\n            Sign In\\n          </Button>\\n          <div className="text-center">\\n            <a href="#" className="text-sm text-blue-600 hover:underline">\\n              Forgot your password?\\n            </a>\\n          </div>\\n        </CardContent>\\n      </Card>\\n    </div>\\n  )\\n}`,
      preview: `<!DOCTYPE html>\\n<html>\\n<head>\\n  <script src="https://cdn.tailwindcss.com"></script>\\n  <style>\\n    .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }\\n  </style>\\n</head>\\n<body>\\n  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">\\n    <div class="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/20">\\n      <div class="text-center mb-8">\\n        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">\\n          Welcome Back\\n        </h1>\\n        <p class="text-gray-600">Sign in to your account</p>\\n      </div>\\n      <form class="space-y-6">\\n        <div>\\n          <input type="email" placeholder="Email address" class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">\\n        </div>\\n        <div>\\n          <input type="password" placeholder="Password" class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">\\n        </div>\\n        <button type="submit" class="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">\\n          Sign In\\n        </button>\\n        <div class="text-center">\\n          <a href="#" class="text-sm text-blue-600 hover:underline">Forgot your password?</a>\\n        </div>\\n      </form>\\n    </div>\\n  </div>\\n</body>\\n</html>`
    },
    dashboard: {
      code: `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\\nimport { Button } from '@/components/ui/button'\\nimport { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react'\\n\\nexport default function Dashboard() {\\n  const stats = [\\n    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign },\\n    { title: 'Active Users', value: '2,350', change: '+15.3%', icon: Users },\\n    { title: 'Growth Rate', value: '12.5%', change: '+2.4%', icon: TrendingUp },\\n    { title: 'Conversion', value: '3.2%', change: '+0.8%', icon: BarChart3 }\\n  ]\\n\\n  return (\\n    <div className="min-h-screen bg-gray-50 p-6">\\n      <div className="max-w-7xl mx-auto">\\n        <div className="mb-8">\\n          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>\\n          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>\\n        </div>\\n        \\n        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\\n          {stats.map((stat, index) => (\\n            <Card key={index} className="hover:shadow-lg transition-shadow">\\n              <CardContent className="p-6">\\n                <div className="flex items-center justify-between">\\n                  <div>\\n                    <p className="text-sm text-gray-600">{stat.title}</p>\\n                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>\\n                    <p className="text-sm text-green-600">{stat.change}</p>\\n                  </div>\\n                  <stat.icon className="h-8 w-8 text-blue-600" />\\n                </div>\\n              </CardContent>\\n            </Card>\\n          ))}\\n        </div>\\n      </div>\\n    </div>\\n  )\\n}`,
      preview: `<!DOCTYPE html>\\n<html>\\n<head>\\n  <script src="https://cdn.tailwindcss.com"></script>\\n</head>\\n<body>\\n  <div class="min-h-screen bg-gray-50 p-6">\\n    <div class="max-w-7xl mx-auto">\\n      <div class="mb-8">\\n        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>\\n        <p class="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>\\n      </div>\\n      \\n      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\\n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\\n          <div class="flex items-center justify-between">\\n            <div>\\n              <p class="text-sm text-gray-600">Total Revenue</p>\\n              <p class="text-2xl font-bold text-gray-900">$45,231</p>\\n              <p class="text-sm text-green-600">+20.1%</p>\\n            </div>\\n            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">\\n              <span class="text-blue-600">$</span>\\n            </div>\\n          </div>\\n        </div>\\n        \\n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\\n          <div class="flex items-center justify-between">\\n            <div>\\n              <p class="text-sm text-gray-600">Active Users</p>\\n              <p class="text-2xl font-bold text-gray-900">2,350</p>\\n              <p class="text-sm text-green-600">+15.3%</p>\\n            </div>\\n            <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">\\n              <span class="text-green-600">👥</span>\\n            </div>\\n          </div>\\n        </div>\\n        \\n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\\n          <div class="flex items-center justify-between">\\n            <div>\\n              <p class="text-sm text-gray-600">Growth Rate</p>\\n              <p class="text-2xl font-bold text-gray-900">12.5%</p>\\n              <p class="text-sm text-green-600">+2.4%</p>\\n            </div>\\n            <div class="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">\\n              <span class="text-purple-600">📈</span>\\n            </div>\\n          </div>\\n        </div>\\n        \\n        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">\\n          <div class="flex items-center justify-between">\\n            <div>\\n              <p class="text-sm text-gray-600">Conversion</p>\\n              <p class="text-2xl font-bold text-gray-900">3.2%</p>\\n              <p class="text-sm text-green-600">+0.8%</p>\\n            </div>\\n            <div class="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">\\n              <span class="text-orange-600">📊</span>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n</body>\\n</html>`
    }
};

const generateAdvancedUI = (message: string): GeneratedUI => {
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

// Enhanced hook for WebSocket management
export function useWebSocket(wsClientId?: string, projectId?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const wsClient = useRef<any>(null)
  
  useEffect(() => {
    const id = wsClientId || clientId
    wsClient.current = createWebSocketClient(id, projectId)
    
    wsClient.current.onMessage('connection_established', () => {
      setIsConnected(true)
    })
    
    wsClient.current.onMessage('*', (data) => {
      setLastMessage({ type: '*', data, timestamp: new Date() })
    })
    
    wsClient.current.connect()
    
    return () => {
      if (wsClient.current) {
        wsClient.current.disconnect()
      }
    }
  }, [wsClientId, projectId])
  
  const sendMessage = useCallback((type: string, data: any) => {
    if (wsClient.current) {
      wsClient.current.sendMessage(type, data)
    }
  }, [])
  
  return { isConnected, lastMessage, sendMessage }
}


export function useMagicUI() {
  const [agents, setAgents] = useState<Record<string, Agent>>(initialAgents)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [generatedUI, setGeneratedUI] = useState<GeneratedUI | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const wsManager = useRef<any>(null)
  const projectId = useRef<string | null>(null)
  
  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = () => {
      wsManager.current = createWebSocketClient(clientId, projectId.current || undefined)
      
      // Set up message handlers
      wsManager.current.onMessage('connection_established', (data) => {
        setIsConnected(true)
        console.log('Connected to Magic UI Studio Pro')
      })
      
      wsManager.current.onMessage('agent_status_update', (data) => {
        setAgents(prev => ({
          ...prev,
          [data.agent_id]: {
            ...prev[data.agent_id],
            status: data.status as AgentStatus,
            progress: data.progress,
            currentTask: data.current_task
          }
        }))
      })
      
      wsManager.current.onMessage('generation_progress', (data) => {
        setIsLoading(data.progress < 100)
      })
      
      wsManager.current.onMessage('generation_complete', (data) => {
        setGeneratedUI(data.result)
        setIsLoading(false)
      })
      
      wsManager.current.onMessage('error', (data) => {
        setError(data.message)
        setIsLoading(false)
      })
      
      wsManager.current.onMessage('chat_message', (data) => {
        setMessages(prev => [...prev, {
          id: data.id,
          type: data.type,
          content: data.content,
          timestamp: new Date(data.timestamp)
        }])
      })
      
      wsManager.current.connect()
    }
    
    initializeConnection()
    
    // Cleanup on unmount
    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect()
      }
    }
  }, [])
  
  // Initialize welcome message
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

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Send chat message to backend
      const chatResponse = await apiClient.sendChatMessage({
        message,
        session_id: clientId,
        project_id: projectId.current
      })
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: chatResponse.id,
        type: 'assistant',
        content: chatResponse.content,
        timestamp: new Date(chatResponse.timestamp)
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // If the message seems like a UI generation request, trigger generation
      if (message.length > 20 && (message.includes('create') || message.includes('build') || message.includes('generate') || message.includes('design'))) {
        await generateUI(message)
      } else {
        setIsLoading(false)
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
      setIsLoading(false)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }, [])
  
  const generateUI = useCallback(async (prompt: string) => {
    try {
      setIsLoading(true)
      
      // Reset agent states
      setAgents(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(agentId => {
          updated[agentId] = { 
            ...updated[agentId], 
            status: AgentStatus.IDLE, 
            progress: 0,
            currentTask: 'Preparing for generation...'
          }
        })
        return updated
      })
      
      // Generate UI using backend service
      const uiResponse = await apiClient.generateUI({
        prompt,
        project_id: projectId.current,
        session_id: clientId
      })
      
      // Update generated UI
      setGeneratedUI({
        id: uiResponse.id,
        requestId: uiResponse.request_id,
        code: uiResponse.code,
        preview: uiResponse.preview,
        components: uiResponse.components,
        metrics: uiResponse.metrics
      })
      
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error generating UI:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate UI')
      setIsLoading(false)
      
      // Fallback to mock generation
      const mockUI = generateAdvancedUI(prompt)
      setGeneratedUI(mockUI)
    }
  }, [])

  // Get agent status from backend
  const refreshAgentStatus = useCallback(async () => {
    try {
      const agentStatus = await apiClient.getAgentStatus()
      const agentsMap: Record<string, Agent> = {}
      
      agentStatus.forEach((agent: any) => {
        agentsMap[agent.id] = {
          name: agent.name,
          specialization: agent.specialization,
          status: agent.status as AgentStatus,
          progress: agent.progress,
          currentTask: agent.current_task,
          performance: agent.performance
        }
      })
      
      setAgents(agentsMap)
    } catch (error) {
      console.error('Error fetching agent status:', error)
      // Keep using initial agents on error
    }
  }, [])
  
  // Periodically refresh agent status
  useEffect(() => {
    const interval = setInterval(refreshAgentStatus, 5000)
    return () => clearInterval(interval)
  }, [refreshAgentStatus])
  
  // Analyze prompt function
  const analyzePrompt = useCallback(async (prompt: string) => {
    try {
      const analysis = await apiClient.analyzePrompt({ prompt })
      return analysis
    } catch (error) {
      console.error('Error analyzing prompt:', error)
      return null
    }
  }, [])

  return { 
    agents, 
    messages, 
    generatedUI, 
    isLoading, 
    isConnected,
    error,
    handleSendMessage, 
    setGeneratedUI,
    generateUI,
    analyzePrompt,
    refreshAgentStatus
  }
}

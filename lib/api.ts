/**
 * API Client for Magic UI Studio Pro
 * Centralized API communication with error handling and type safety
 */

import { ChatMessage, GeneratedUI, Agent } from './types'

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'demo-key'

// Request/Response Types
export interface ChatRequest {
  message: string
  session_id?: string
  project_id?: string
  context?: Record<string, any>
}

export interface ChatResponse {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  suggestions?: string[]
  metadata?: Record<string, any>
}

export interface DesignRequest {
  prompt: string
  page_type?: string
  style_preferences?: string[]
  complexity?: string
  requirements?: string[]
  project_id?: string
  session_id?: string
}

export interface UIGenerationResponse {
  id: string
  request_id: string
  code: string
  preview: string
  components: any[]
  metrics: {
    novelty: number
    quality: number
    performance: number
    accessibility: number
  }
  status: string
  created_at: string
}

export interface PromptAnalysisRequest {
  prompt: string
  context?: Record<string, any>
}

export interface DesignIntentResponse {
  page_type: string
  style_preferences: string[]
  components: string[]
  layout: string
  complexity: number
  business_domain: string
  target_audience: string
  brand_personality: string[]
  functional_requirements: string[]
  technical_requirements: string[]
  confidence: number
}

export interface AgentStatusResponse {
  id: string
  name: string
  specialization: string[]
  status: 'idle' | 'working' | 'completed' | 'error'
  progress: number
  current_task: string
  performance: {
    successRate: number
    qualityScore: number
    avgDuration: number
  }
}

// API Error Class
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// API Client Class
export class MagicUIAPIClient {
  private baseURL: string
  private apiKey: string

  constructor(baseURL: string = API_BASE_URL, apiKey: string = API_KEY) {
    this.baseURL = baseURL
    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      )
    }
  }

  // Chat API
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async getChatHistory(skip = 0, limit = 100): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/chat/history?skip=${skip}&limit=${limit}`)
  }

  // UI Generation API
  async generateUI(request: DesignRequest): Promise<UIGenerationResponse> {
    return this.request<UIGenerationResponse>('/generate-ui', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Mock endpoints for testing
  async generateUIMock(request: DesignRequest): Promise<any> {
    return this.request('/generate-ui/mock', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async sendChatMessageMock(request: ChatRequest): Promise<any> {
    return this.request('/chat/mock', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Prompt Analysis API
  async analyzePrompt(request: PromptAnalysisRequest): Promise<DesignIntentResponse> {
    return this.request<DesignIntentResponse>('/analyze-prompt', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async analyzePromptMock(request: PromptAnalysisRequest): Promise<any> {
    return this.request('/analyze-prompt/mock', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Agent Status API
  async getAgentStatus(): Promise<AgentStatusResponse[]> {
    return this.request<AgentStatusResponse[]>('/agents/status')
  }

  async getAgentStatusMock(): Promise<any[]> {
    return this.request('/agents/status/mock')
  }

  // Health Check API
  async healthCheck(): Promise<any> {
    return this.request('/health')
  }

  // WebSocket Stats API
  async getWebSocketStats(): Promise<any> {
    return this.request('/websocket/stats')
  }
}

// WebSocket Client Class
export class MagicUIWebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private clientId: string
  private projectId: string | null = null
  private isConnecting = false

  constructor(clientId: string, projectId?: string) {
    this.clientId = clientId
    this.projectId = projectId || null
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
        return
      }

      this.isConnecting = true

      try {
        const wsUrl = `${WS_BASE_URL}/${this.clientId}${this.projectId ? `?project_id=${this.projectId}` : ''}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            const handler = this.messageHandlers.get(message.type)
            if (handler) {
              handler(message.data)
            }
            
            // Also call wildcard handler
            const wildcardHandler = this.messageHandlers.get('*')
            if (wildcardHandler) {
              wildcardHandler(message)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }

        // Timeout for connection
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false
            reject(new Error('WebSocket connection timeout'))
          }
        }, 10000)

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  sendMessage(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket not connected, message not sent:', { type, data })
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  get readyState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instances
export const apiClient = new MagicUIAPIClient()
export const createWebSocketClient = (clientId: string, projectId?: string) => 
  new MagicUIWebSocketClient(clientId, projectId)

// Utility functions
export function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Error handling utilities
export function isAPIError(error: any): error is APIError {
  return error instanceof APIError
}

export function handleAPIError(error: any): string {
  if (isAPIError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

// Type guards
export function isChatResponse(obj: any): obj is ChatResponse {
  return obj && typeof obj.id === 'string' && typeof obj.content === 'string'
}

export function isUIGenerationResponse(obj: any): obj is UIGenerationResponse {
  return obj && typeof obj.id === 'string' && typeof obj.code === 'string'
}

export function isAgentStatusResponse(obj: any): obj is AgentStatusResponse {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string'
}

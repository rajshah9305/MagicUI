import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  GenerationRequest, 
  GenerationResponse, 
  ChatMessage, 
  PatchRequest, 
  PatchResponse,
  ExportRequest,
  ExportResponse,
  GeminiRequest,
  GeminiResponse,
  PreviewManifest,
  Agent,
  PerformanceMetrics
} from './types';

class MagicUIAPI {
  private api: AxiosInstance;
  private ws: WebSocket | null = null;
  private wsListeners: Map<string, (data: any) => void> = new Map();

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.api = axios.create({
      baseURL: `${baseURL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('magic_ui_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('magic_ui_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // WebSocket Connection
  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CLOSED) {
            this.connectWebSocket();
          }
        }, 3000);
      };
    });
  }

  private handleWebSocketMessage(message: any) {
    const { type, data } = message;
    const listener = this.wsListeners.get(type);
    if (listener) {
      listener(data);
    }
  }

  onWebSocketMessage(type: string, callback: (data: any) => void) {
    this.wsListeners.set(type, callback);
  }

  offWebSocketMessage(type: string) {
    this.wsListeners.delete(type);
  }

  // Generation API
  async generateUI(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response: AxiosResponse<GenerationResponse> = await this.api.post('/generate', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate UI');
    }
  }

  async getPreviewManifest(): Promise<PreviewManifest> {
    try {
      const response: AxiosResponse<PreviewManifest> = await this.api.get('/preview/manifest');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get preview manifest');
    }
  }

  // Chat API
  async sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    try {
      const response: AxiosResponse<ChatMessage> = await this.api.post('/chat', message);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send chat message');
    }
  }

  async getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
    try {
      const response: AxiosResponse<ChatMessage[]> = await this.api.get(`/chat/history?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get chat history');
    }
  }

  // Patch API
  async applyPatch(request: PatchRequest): Promise<PatchResponse> {
    try {
      const response: AxiosResponse<PatchResponse> = await this.api.post('/patch', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to apply patch');
    }
  }

  // Export API
  async exportVariants(request: ExportRequest): Promise<ExportResponse> {
    try {
      const response: AxiosResponse<ExportResponse> = await this.api.post('/export', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to export variants');
    }
  }

  // Agent API
  async getAgents(): Promise<Agent[]> {
    try {
      const response: AxiosResponse<Agent[]> = await this.api.get('/agents');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get agents');
    }
  }

  async getAgentStatus(agentId: string): Promise<Agent> {
    try {
      const response: AxiosResponse<Agent> = await this.api.get(`/agents/${agentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get agent status');
    }
  }

  // Gemini API
  async callGemini(request: GeminiRequest): Promise<GeminiResponse> {
    try {
      const response: AxiosResponse<GeminiResponse> = await this.api.post('/gemini', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to call Gemini API');
    }
  }

  // Performance API
  async getPerformanceMetrics(): Promise<PerformanceMetrics[]> {
    try {
      const response: AxiosResponse<PerformanceMetrics[]> = await this.api.get('/metrics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get performance metrics');
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/health');
      return {
        status: response.data.status,
        timestamp: new Date(response.data.timestamp)
      };
    } catch (error: any) {
      throw new Error('API health check failed');
    }
  }

  // Utility Methods
  async uploadFile(file: File, variantId: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('variant_id', variantId);

      const response: AxiosResponse<{ url: string }> = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }

  async downloadVariant(variantId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await this.api.get(`/download/${variantId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to download variant');
    }
  }

  // Cleanup
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.wsListeners.clear();
  }
}

// Create singleton instance
export const api = new MagicUIAPI();

// Export types for convenience
export type { 
  GenerationRequest, 
  GenerationResponse, 
  ChatMessage, 
  PatchRequest, 
  PatchResponse,
  ExportRequest,
  ExportResponse,
  GeminiRequest,
  GeminiResponse,
  PreviewManifest,
  Agent,
  PerformanceMetrics
};
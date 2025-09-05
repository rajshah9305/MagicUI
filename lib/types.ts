export enum AgentStatus {
  IDLE = "idle",
  WORKING = "working",
  COMPLETED = "completed",
  ERROR = "error",
}

export interface AgentPerformance {
  successRate: number;
  qualityScore: number;
  avgDuration: number;
}

export interface Agent {
  name: string;
  specialization: string[];
  status: AgentStatus;
  progress: number;
  currentTask: string;
  performance: AgentPerformance;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IntelligenceMetrics {
  novelty: number;
  quality: number;
  performance: number;
  accessibility: number;
}

export interface GeneratedUI {
  id: string;
  requestId: string;
  code: string;
  preview: string;
  components: any[]; // You might want to define a proper type for components
  metrics: IntelligenceMetrics;
}

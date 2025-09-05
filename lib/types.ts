export interface UISchema {
  page_type: string;
  title: string;
  sections: Section[];
  states: string[];
  accessibility_notes: string[];
}

export interface Section {
  id: string;
  type: string;
  layout?: {
    grid: string;
    breakpoints: Record<string, number>;
  };
  components: Component[];
}

export interface Component {
  type: string;
  id?: string;
  content?: string;
  level?: number;
  width?: string;
  columns?: number;
  items?: Component[];
  components?: Component[];
}

export interface StyleSpec {
  style_name: string;
  novelty_score: number;
  trend_tags: string[];
  colors: {
    bg: string;
    surface: string;
    text: string;
    primary: string;
    accent: string;
    muted: string;
  };
  typography: {
    font_heading: string;
    font_body: string;
    scale: number;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    unit: string;
    sectionY: string;
  };
  shadows: {
    e1: string;
  };
  effects: string[];
  component_variants: Record<string, string>;
  a11y: {
    min_contrast: string;
  };
}

export interface Variant {
  id: string;
  name: string;
  style: string;
  style_spec: string;
  build: string;
  novelty: number;
  preview: string;
  metadata: {
    width: number;
    height: number;
    responsive: boolean;
  };
}

export interface PreviewManifest {
  brief: string;
  ui_schema_path: string;
  variants: Variant[];
  preview_manifest: string;
  generated_at: string;
  version: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'agent';
  agent?: string;
  text: string;
  timestamp: Date;
  metadata?: {
    variant_id?: string;
    action?: string;
    status?: 'pending' | 'processing' | 'completed' | 'error';
  };
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'idle' | 'working' | 'error';
  last_activity: Date;
  capabilities: string[];
}

export interface GenerationRequest {
  brief: string;
  mood?: string;
  style_preferences?: string[];
  target_platforms?: string[];
  accessibility_level?: 'A' | 'AA' | 'AAA';
}

export interface GenerationResponse {
  success: boolean;
  manifest: PreviewManifest;
  error?: string;
  processing_time: number;
}

export interface PatchRequest {
  variant_id: string;
  target: 'UI_SCHEMA' | 'STYLE_SPEC' | 'code';
  patches: PatchOperation[];
}

export interface PatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: any;
  from?: string;
}

export interface PatchResponse {
  success: boolean;
  updated_manifest: PreviewManifest;
  error?: string;
}

export interface ExportRequest {
  variant_ids: string[];
  format: 'zip' | 'vercel' | 'docker';
  include_assets: boolean;
  optimize: boolean;
}

export interface ExportResponse {
  success: boolean;
  download_url?: string;
  vercel_config?: any;
  error?: string;
}

export interface DesignMemory {
  user_id: string;
  style_dna: {
    preferred_colors: string[];
    preferred_typography: string[];
    preferred_layouts: string[];
    avoided_patterns: string[];
  };
  novelty_hashes: string[];
  last_updated: Date;
}

export interface NeuralNetworkNode {
  id: string;
  type: 'agent' | 'data' | 'process';
  position: { x: number; y: number };
  status: 'idle' | 'active' | 'completed' | 'error';
  connections: string[];
  data?: any;
}

export interface NeuralNetworkConnection {
  id: string;
  from: string;
  to: string;
  status: 'inactive' | 'active' | 'completed' | 'error';
  data_flow: number;
}

export interface PerformanceMetrics {
  generation_time: number;
  quality_score: number;
  accessibility_score: number;
  novelty_score: number;
  user_satisfaction: number;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'generation_update' | 'agent_status' | 'neural_network_update' | 'chat_message' | 'error';
  data: any;
  timestamp: Date;
}

export interface GeminiResponse {
  success: boolean;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
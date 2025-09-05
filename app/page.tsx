'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Code, 
  Palette, 
  Eye, 
  Bug, 
  Download, 
  Send, 
  Pin, 
  Copy, 
  Settings,
  Zap,
  Brain,
  Layers,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useChat, usePreviewManifest, useGeneration, useAgents, useVariantSelection } from '@/lib/hooks';
import { cn, formatRelativeTime, copyToClipboard, downloadFile } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data for initial state
const initialVariants = [
  { 
    id: 'v1', 
    name: 'Retro Mesh', 
    style: 'retro-futurism-mesh',
    preview: '/previews/v1/index.html',
    novelty: 0.92,
    metadata: { width: 1200, height: 800, responsive: true }
  },
  { 
    id: 'v2', 
    name: 'Glass Aurora', 
    style: 'glass-aurora',
    preview: '/previews/v2/index.html',
    novelty: 0.88,
    metadata: { width: 1200, height: 800, responsive: true }
  },
  { 
    id: 'v3', 
    name: 'Brutalist', 
    style: 'brutalist-editorial',
    preview: '/previews/v3/index.html',
    novelty: 0.85,
    metadata: { width: 1200, height: 800, responsive: true }
  },
  { 
    id: 'v4', 
    name: 'Minimal Mono', 
    style: 'minimal-monochrome',
    preview: '/previews/v4/index.html',
    novelty: 0.90,
    metadata: { width: 1200, height: 800, responsive: true }
  },
];

const agents = [
  { id: 'architect', name: 'Design Architect', role: 'UI Structure', icon: Layers, status: 'idle' as const },
  { id: 'curator', name: 'Style Curator', role: 'Visual Design', icon: Palette, status: 'working' as const },
  { id: 'generator', name: 'Code Generator', role: 'Implementation', icon: Code, status: 'idle' as const },
  { id: 'previewer', name: 'Preview Engine', role: 'Live Preview', icon: Eye, status: 'idle' as const },
  { id: 'qa', name: 'QA Engineer', role: 'Quality Assurance', icon: Bug, status: 'idle' as const },
  { id: 'exporter', name: 'Export Manager', role: 'Deployment', icon: Download, status: 'idle' as const },
];

export default function MagicUIElite() {
  const [brief, setBrief] = useState('');
  const [mood, setMood] = useState('futuristic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [neuralNetwork, setNeuralNetwork] = useState(true);
  
  const { messages, isLoading: chatLoading, sendMessage } = useChat();
  const { manifest, isLoading: manifestLoading } = usePreviewManifest();
  const { isGenerating: genLoading, progress, currentStep } = useGeneration();
  const { agents: agentList, isLoading: agentsLoading } = useAgents();
  const { selectedVariant, pinnedVariants, selectVariant, togglePin } = useVariantSelection();

  const variants = manifest?.variants || initialVariants;
  const activeAgents = agentList.length > 0 ? agentList : agents;

  const handleGenerate = async () => {
    if (!brief.trim()) {
      toast.error('Please describe your UI idea');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('UI variants generated successfully!');
    } catch (error) {
      toast.error('Failed to generate UI variants');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(selectedAgent === agentId ? null : agentId);
  };

  const handleCopyCode = async (variantId: string) => {
    try {
      await copyToClipboard(`// Generated code for ${variantId}`);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleExport = async (variantId: string) => {
    try {
      downloadFile('// Export placeholder', `${variantId}-export.zip`, 'application/zip');
      toast.success('Export started!');
    } catch (error) {
      toast.error('Failed to export variant');
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-bg" />
      
      {/* Neural Network Visualization */}
      {neuralNetwork && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-20 w-4 h-4 neural-node" />
          <div className="absolute top-32 right-32 w-3 h-3 neural-node" />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 neural-node" />
          <div className="absolute bottom-20 right-20 w-5 h-5 neural-node" />
        </div>
      )}

      <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 h-screen">
          
          {/* Left Panel - Agents */}
          <aside className="col-span-3 glass-premium rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-token-primary to-token-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-token-bg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Magic Studio</h1>
                <p className="text-sm text-token-muted">AI-Powered UI Generation</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-token-muted uppercase tracking-wider">Agents</h3>
              {activeAgents.map((agent) => {
                const Icon = agent.icon;
    return (
                  <motion.button
                    key={agent.id}
                    onClick={() => handleAgentClick(agent.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                      selectedAgent === agent.id 
                        ? "bg-gradient-to-r from-token-primary/20 to-token-accent/20 border border-token-primary/30" 
                        : "hover:bg-white/5"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      agent.status === 'working' 
                        ? "bg-token-primary/20 text-token-primary" 
                        : "bg-token-muted/20 text-token-muted"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-token-muted">{agent.role}</div>
                    </div>
                    {agent.status === 'working' && (
                      <div className="w-2 h-2 rounded-full bg-token-primary animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-token-muted uppercase tracking-wider mb-4">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {['futuristic', 'minimal', 'playful', 'professional'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      mood === m 
                        ? "bg-token-primary text-token-bg" 
                        : "bg-white/5 text-token-muted hover:bg-white/10"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-token-muted uppercase tracking-wider">Neural Network</h3>
                <button
                  onClick={() => setNeuralNetwork(!neuralNetwork)}
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors",
                    neuralNetwork ? "bg-token-primary" : "bg-token-muted/30"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    neuralNetwork ? "translate-x-5" : "translate-x-1"
                  )} />
                </button>
              </div>
              <div className="text-xs text-token-muted">
                Real-time agent connections and data flow visualization
              </div>
            </div>
          </aside>

          {/* Center Panel - Live Preview */}
          <section className="col-span-6 space-y-6">
            {/* Input Section */}
            <div className="glass-premium rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Describe your UI: e.g., dashboard with sidebar and stats"
                    className="w-full input-premium text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                </div>
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating || !brief.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-token-bg border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Progress Bar */}
              {isGenerating && (
            <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-token-muted">{currentStep}</span>
                    <span className="text-token-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-token-surface rounded-full h-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-token-primary to-token-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 gap-6">
              {variants.map((variant, index) => (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "glass-premium rounded-2xl overflow-hidden transition-all duration-300",
                    selectedVariant === variant.id 
                      ? "ring-2 ring-token-primary shadow-neural" 
                      : "hover:scale-105 hover:shadow-premium"
                  )}
                >
                  {/* Preview Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-token-text">{variant.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-token-muted">
                          <span>{variant.style}</span>
                          <span>•</span>
                          <span>Novelty: {Math.round(variant.novelty * 100)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePin(variant.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            pinnedVariants.has(variant.id)
                              ? "bg-token-primary/20 text-token-primary"
                              : "hover:bg-white/10 text-token-muted"
                          )}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => selectVariant(variant.id)}
                          className="px-3 py-1.5 rounded-lg bg-token-primary/10 text-token-primary text-xs font-medium hover:bg-token-primary/20 transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Iframe */}
                  <div className="relative h-64 bg-token-surface">
                    <iframe
                      src={variant.preview}
                      className="w-full h-full border-0"
                      title={`${variant.name} Preview`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-token-bg/20 to-transparent pointer-events-none" />
                  </div>

                  {/* Preview Actions */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(variant.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-token-muted transition-colors"
                        title="Copy Code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExport(variant.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-token-muted transition-colors"
                        title="Export"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-token-muted">
                      {variant.id.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between glass-premium rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Code
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-token-muted transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 text-token-muted transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Right Panel - Chat */}
          <aside className="col-span-3 glass-premium rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-token-primary to-token-accent flex items-center justify-center">
                <Brain className="w-4 h-4 text-token-bg" />
              </div>
              <div>
                <h3 className="font-semibold text-token-text">Chat with Crew</h3>
                <p className="text-xs text-token-muted">AI-powered assistance</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((message) => (
            <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "p-3 rounded-xl text-sm",
                      message.role === 'user' 
                        ? "bg-token-primary/20 text-token-text ml-8" 
                        : "bg-white/5 text-token-text mr-8"
                    )}
                  >
                    <div className="font-medium text-xs text-token-muted mb-1">
                      {message.role === 'user' ? 'You' : message.agent || 'System'}
                    </div>
                    <div>{message.text}</div>
                    <div className="text-xs text-token-muted mt-1">
                      {formatRelativeTime(message.timestamp)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                placeholder="Ask the crew..."
                className="flex-1 input-premium"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      sendMessage(input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <motion.button
                className="p-3 rounded-lg bg-token-primary text-token-bg hover:bg-token-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  Generate More
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  Refine Style
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  Export Code
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  Share
                </button>
            </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
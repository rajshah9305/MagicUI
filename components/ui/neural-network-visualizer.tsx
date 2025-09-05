'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Agent, AgentStatus } from "@/lib/types"
import { Brain, Zap, ArrowRight, Activity, Cpu } from "lucide-react"

interface NeuralNode {
  id: string
  x: number
  y: number
  size: number
  active: boolean
  agentType: string
  connections: string[]
}

interface NeuralConnection {
  from: string
  to: string
  active: boolean
  strength: number
}

interface NeuralNetworkVisualizerProps {
  agents: Record<string, Agent>
  isProcessing: boolean
}

export function NeuralNetworkVisualizer({ agents, isProcessing }: NeuralNetworkVisualizerProps) {
  const [nodes, setNodes] = useState<NeuralNode[]>([])
  const [connections, setConnections] = useState<NeuralConnection[]>([])
  const [pulseData, setPulseData] = useState<{ from: string; to: string; id: string }[]>([])

  useEffect(() => {
    // Initialize neural network structure
    const agentEntries = Object.entries(agents)
    const networkNodes: NeuralNode[] = agentEntries.map(([id, agent], index) => ({
      id,
      x: 100 + (index % 3) * 150,
      y: 80 + Math.floor(index / 3) * 120,
      size: agent.status === AgentStatus.WORKING ? 16 : 12,
      active: agent.status === AgentStatus.WORKING || agent.status === AgentStatus.COMPLETED,
      agentType: agent.name,
      connections: agentEntries
        .filter((_, i) => i === index + 1)
        .map(([connectedId]) => connectedId)
    }))

    const networkConnections: NeuralConnection[] = []
    for (let i = 0; i < agentEntries.length - 1; i++) {
      networkConnections.push({
        from: agentEntries[i][0],
        to: agentEntries[i + 1][0],
        active: agentEntries[i][1].status === AgentStatus.COMPLETED,
        strength: agentEntries[i][1].progress / 100
      })
    }

    setNodes(networkNodes)
    setConnections(networkConnections)
  }, [agents])

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      const activeConnections = connections.filter(c => c.active)
      if (activeConnections.length === 0) return

      const randomConnection = activeConnections[Math.floor(Math.random() * activeConnections.length)]
      const pulseId = `pulse-${Date.now()}-${Math.random()}`
      
      setPulseData(prev => [...prev, {
        from: randomConnection.from,
        to: randomConnection.to,
        id: pulseId
      }])

      // Remove pulse after animation
      setTimeout(() => {
        setPulseData(prev => prev.filter(p => p.id !== pulseId))
      }, 1000)
    }, 300)

    return () => clearInterval(interval)
  }, [connections, isProcessing])

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  const getAgentColor = (agent: Agent) => {
    switch (agent.status) {
      case AgentStatus.WORKING:
        return 'from-amber-400 to-orange-500'
      case AgentStatus.COMPLETED:
        return 'from-green-400 to-emerald-500'
      case AgentStatus.ERROR:
        return 'from-red-400 to-rose-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 1px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Neural Network SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 320">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)"/>
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.8)"/>
          </linearGradient>
        </defs>

        {/* Connections */}
        {connections.map((connection) => {
          const fromPos = getNodePosition(connection.from)
          const toPos = getNodePosition(connection.to)
          
          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="url(#connectionGradient)"
              strokeWidth={connection.active ? 2 : 1}
              opacity={connection.active ? 0.8 : 0.3}
              filter={connection.active ? "url(#glow)" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: connection.strength,
                opacity: connection.active ? 0.8 : 0.3
              }}
              transition={{ duration: 0.5 }}
            />
          )
        })}

        {/* Data Pulses */}
        <AnimatePresence>
          {pulseData.map((pulse) => {
            const fromPos = getNodePosition(pulse.from)
            const toPos = getNodePosition(pulse.to)
            
            return (
              <motion.circle
                key={pulse.id}
                r="4"
                fill="rgba(59, 130, 246, 0.9)"
                filter="url(#glow)"
                initial={{ cx: fromPos.x, cy: fromPos.y, opacity: 0 }}
                animate={{ 
                  cx: toPos.x, 
                  cy: toPos.y, 
                  opacity: [0, 1, 0] 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )
          })}
        </AnimatePresence>

        {/* Neural Nodes */}
        {nodes.map((node) => {
          const agent = agents[node.id]
          return (
            <g key={node.id}>
              {/* Node Glow Effect */}
              {node.active && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 8}
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth="1"
                  initial={{ r: node.size }}
                  animate={{ r: node.size + 8 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {/* Main Node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={node.active ? "rgba(59, 130, 246, 0.9)" : "rgba(100, 116, 139, 0.6)"}
                stroke={node.active ? "rgba(59, 130, 246, 1)" : "rgba(100, 116, 139, 0.8)"}
                strokeWidth="2"
                filter={node.active ? "url(#glow)" : undefined}
                animate={{ 
                  r: node.size,
                  fill: node.active ? "rgba(59, 130, 246, 0.9)" : "rgba(100, 116, 139, 0.6)"
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Processing Animation */}
              {agent.status === AgentStatus.WORKING && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.8)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Agent Labels */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(agents).map(([id, agent], index) => {
          const node = nodes.find(n => n.id === id)
          if (!node) return null

          return (
            <motion.div
              key={id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${(node.x / 500) * 100}%`, 
                top: `${(node.y / 320) * 100}%`,
                marginTop: '30px'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getAgentColor(agent)} text-white shadow-lg`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                  {agent.name.split(' ')[0]}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {agent.progress}%
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Network Stats */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-white font-medium">
            {Object.values(agents).filter(a => a.status === AgentStatus.WORKING).length} Active
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <Cpu className="w-4 h-4 text-green-400" />
          <span className="text-xs text-white font-medium">
            {Object.values(agents).filter(a => a.status === AgentStatus.COMPLETED).length} Complete
          </span>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg border border-amber-500/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-amber-400" />
            </motion.div>
            <span className="text-sm text-amber-100 font-medium">Neural Processing</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-amber-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

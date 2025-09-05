'use client'

import { motion } from "framer-motion"
import { Card as PremiumCard } from "@/components/ui/card"
import { Progress as PremiumProgress } from "@/components/ui/progress"
import { Agent, AgentStatus } from "@/lib/types"
import { Brain, Star } from "lucide-react"
import { AgentCard } from "./agent-card"
import { NeuralNetworkVisualizer } from "./neural-network-visualizer"

interface PremiumAgentDashboardProps {
  agents: Record<string, Agent>
  showNeuralNetwork?: boolean
}

export function AgentDashboard({ agents, showNeuralNetwork = true }: PremiumAgentDashboardProps) {
  const completedAgents = Object.values(agents).filter(a => a.status === AgentStatus.COMPLETED).length
  const totalAgents = Object.keys(agents).length
  const overallProgress = Object.values(agents).reduce((sum, agent) => sum + agent.progress, 0) / totalAgents

  const isProcessing = Object.values(agents).some(agent => agent.status === AgentStatus.WORKING)

  return (
    <PremiumCard variant="elevated" className="p-4 h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
          <div className="p-2 bg-gradient-primary rounded-xl shadow-elevated">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div>Elite CrewAI Dashboard</div>
            <div className="text-sm font-normal text-gray-600 mt-1">
              Real-time AI agent monitoring
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      {showNeuralNetwork && (
        <div className="mb-4">
          <NeuralNetworkVisualizer agents={agents} isProcessing={isProcessing} />
        </div>
      )}
      
      <CardContent className="flex-grow overflow-y-auto px-2 space-y-3">
        {Object.entries(agents).map(([id, agent], index) => (
          <AgentCard key={id} agentId={id} agent={agent} index={index} />
        ))}
      </CardContent>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-2"
      >
        <PremiumCard variant="gradient" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-white" />
              <h4 className="text-base font-semibold text-white">Overall Progress</h4>
            </div>
            <div className="text-white/80 text-sm">
              {completedAgents} / {totalAgents} Complete
            </div>
          </div>
          
          <PremiumProgress
            value={overallProgress}
            variant="glow"
            size="md"
            showValue
            animated
          />
        </PremiumCard>
      </motion.div>
    </PremiumCard>
  )
}

'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumProgress } from "@/components/ui/premium-progress"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { EliteAgent, AgentStatus } from "@/lib/elite-orchestrator"
import { 
  Brain, 
  Palette, 
  Code, 
  Eye, 
  Shield, 
  Package,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap,
  Star
} from "lucide-react"

interface PremiumAgentDashboardProps {
  agents: Record<string, EliteAgent>
}

export function PremiumAgentDashboard({ agents }: PremiumAgentDashboardProps) {
  const getAgentIcon = (agentId: string) => {
    const icons = {
      architect: Brain,
      style_curator: Palette,
      code_generator: Code,
      previewer: Eye,
      qa_engineer: Shield,
      exporter: Package
    }
    return icons[agentId as keyof typeof icons] || Brain
  }

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.COMPLETE:
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case AgentStatus.ACTIVE:
      case AgentStatus.ANALYZING:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-primary-500" />
          </motion.div>
        )
      case AgentStatus.ERROR:
        return <AlertCircle className="h-4 w-4 text-error-500" />
      case AgentStatus.OPTIMIZING:
        return <TrendingUp className="h-4 w-4 text-accent-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusVariant = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.COMPLETE:
        return 'success'
      case AgentStatus.ACTIVE:
      case AgentStatus.ANALYZING:
        return 'primary'
      case AgentStatus.ERROR:
        return 'error'
      case AgentStatus.OPTIMIZING:
        return 'accent'
      default:
        return 'default'
    }
  }

  const getProgressVariant = (progress: number, status: AgentStatus) => {
    if (status === AgentStatus.COMPLETE) return 'success'
    if (status === AgentStatus.ERROR) return 'error'
    if (progress > 75) return 'primary'
    if (progress > 50) return 'accent'
    return 'default'
  }

  const getAgentGradient = (agentId: string) => {
    const gradients = {
      architect: "from-primary-500 to-primary-700",
      style_curator: "from-accent-500 to-accent-700",
      code_generator: "from-secondary-500 to-secondary-700",
      previewer: "from-success-500 to-success-700",
      qa_engineer: "from-warning-500 to-warning-700",
      exporter: "from-error-500 to-error-700"
    }
    return gradients[agentId as keyof typeof gradients] || "from-primary-500 to-primary-700"
  }

  return (
    <PremiumCard variant="elevated" className="p-6">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
          <div className="p-3 bg-gradient-primary rounded-2xl shadow-elevated">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <div>Elite CrewAI Agent Dashboard</div>
            <div className="text-sm font-normal text-gray-600 mt-1">
              Real-time AI agent monitoring and orchestration
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {Object.entries(agents).map(([id, agent], index) => {
            const IconComponent = getAgentIcon(id)
            const gradient = getAgentGradient(id)
            
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <PremiumCard 
                  variant="elevated" 
                  hover 
                  glow={agent.status === AgentStatus.ACTIVE}
                  className="h-full"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg shadow-soft flex-shrink-0`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{agent.name}</h3>
                          <p className="text-xs text-gray-600 capitalize truncate">
                            {agent.specialization[0]?.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {getStatusIcon(agent.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 p-3">
                    {/* Status Badge */}
                    <PremiumBadge 
                      variant={getStatusVariant(agent.status)}
                      size="sm"
                      glow={agent.status === AgentStatus.ACTIVE}
                    >
                      {agent.status.replace('_', ' ').toUpperCase()}
                    </PremiumBadge>

                    {/* Progress Bar */}
                    <PremiumProgress
                      value={agent.progress}
                      variant={getProgressVariant(agent.progress, agent.status)}
                      size="sm"
                      showValue
                      animated
                      label="Progress"
                    />

                    {/* Current Task */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-700">Current Task</div>
                      <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 min-h-[2rem] flex items-center">
                        {agent.currentTask}
                      </div>
                    </div>

                    {/* Performance Metrics - Compact */}
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center p-1 bg-success-50 rounded">
                        <div className="text-xs text-success-600 font-medium">Success</div>
                        <div className="text-xs font-bold text-success-700">
                          {Math.round(agent.performance.successRate * 100)}%
                        </div>
                      </div>
                      <div className="text-center p-1 bg-primary-50 rounded">
                        <div className="text-xs text-primary-600 font-medium">Quality</div>
                        <div className="text-xs font-bold text-primary-700">
                          {Math.round(agent.performance.qualityScore * 100)}%
                        </div>
                      </div>
                      <div className="text-center p-1 bg-accent-50 rounded">
                        <div className="text-xs text-accent-600 font-medium">Speed</div>
                        <div className="text-xs font-bold text-accent-700">
                          {Math.round(agent.performance.avgDuration / 1000)}s
                        </div>
                      </div>
                    </div>

                    {/* Specializations - Compact */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-700">Specializations</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialization.slice(0, 2).map((spec, idx) => (
                          <PremiumBadge 
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs px-1 py-0"
                          >
                            {spec.replace('_', ' ')}
                          </PremiumBadge>
                        ))}
                        {agent.specialization.length > 2 && (
                          <PremiumBadge 
                            variant="default"
                            size="sm"
                            className="text-xs px-1 py-0"
                          >
                            +{agent.specialization.length - 2}
                          </PremiumBadge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </PremiumCard>
              </motion.div>
            )
          })}
        </div>

        {/* Overall Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <PremiumCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-white" />
                <h4 className="text-lg font-semibold text-white">Overall Progress</h4>
              </div>
              <div className="text-white/80">
                {Object.values(agents).filter(a => a.status === AgentStatus.COMPLETE).length} / {Object.keys(agents).length} Complete
              </div>
            </div>
            
            <PremiumProgress
              value={Object.values(agents).reduce((sum, agent) => sum + agent.progress, 0) / Object.keys(agents).length}
              variant="glow"
              size="lg"
              showValue
              animated
            />
          </PremiumCard>
        </motion.div>
      </CardContent>
    </PremiumCard>
  )
}

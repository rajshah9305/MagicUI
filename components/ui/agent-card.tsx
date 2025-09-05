'use client'

import { motion } from "framer-motion"
import { PremiumCard, CardHeader, CardContent } from "@/components/ui/premium-card"
import { PremiumProgress } from "@/components/ui/premium-progress"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { Agent, AgentStatus } from "@/lib/types"
import { 
  Brain, Palette, Code, Eye, Shield, Package,
  Clock, CheckCircle, AlertCircle, Zap
} from "lucide-react"

interface AgentCardProps {
  agent: Agent;
  agentId: string;
  index: number;
}

const AGENT_ICONS: Record<string, React.ElementType> = {
  architect: Brain,
  style_curator: Palette,
  code_generator: Code,
  previewer: Eye,
  qa_engineer: Shield,
  exporter: Package
};

const AGENT_GRADIENTS: Record<string, string> = {
  architect: "from-primary-500 to-primary-700",
  style_curator: "from-accent-500 to-accent-700",
  code_generator: "from-secondary-500 to-secondary-700",
  previewer: "from-success-500 to-success-700",
  qa_engineer: "from-warning-500 to-warning-700",
  exporter: "from-error-500 to-error-700"
};

const getStatusIcon = (status: AgentStatus) => {
  switch (status) {
    case AgentStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4 text-success-500" />
    case AgentStatus.WORKING:
      return (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Zap className="h-4 w-4 text-primary-500" />
        </motion.div>
      )
    case AgentStatus.ERROR:
      return <AlertCircle className="h-4 w-4 text-error-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
};

const getStatusVariant = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.COMPLETED: return 'success'
      case AgentStatus.WORKING: return 'primary'
      case AgentStatus.ERROR: return 'error'
      default: return 'default'
    }
};

const getProgressVariant = (progress: number, status: AgentStatus) => {
    if (status === AgentStatus.COMPLETED) return 'success'
    if (status === AgentStatus.ERROR) return 'error'
    if (progress > 75) return 'primary'
    if (progress > 50) return 'accent'
    return 'default'
};

export function AgentCard({ agent, agentId, index }: AgentCardProps) {
  const IconComponent = AGENT_ICONS[agentId] || Brain;
  const gradient = AGENT_GRADIENTS[agentId] || "from-primary-500 to-primary-700";

  return (
    <motion.div
      key={agentId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <PremiumCard 
        variant="elevated" 
        hover 
        glow={agent.status === AgentStatus.WORKING}
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
          <PremiumBadge 
            variant={getStatusVariant(agent.status)}
            size="sm"
            glow={agent.status === AgentStatus.WORKING}
          >
            {agent.status.replace('_', ' ').toUpperCase()}
          </PremiumBadge>

          <PremiumProgress
            value={agent.progress}
            variant={getProgressVariant(agent.progress, agent.status)}
            size="sm"
            showValue
            animated
            label="Progress"
          />

          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-700">Current Task</div>
            <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 min-h-[2rem] flex items-center">
              {agent.currentTask}
            </div>
          </div>

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
}

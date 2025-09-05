'use client'

import { motion } from "framer-motion"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumProgress } from "@/components/ui/premium-progress"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { 
  Brain, 
  Star, 
  Zap, 
  Shield, 
  Target,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react"

interface IntelligenceMetrics {
  novelty: number
  quality: number
  performance: number
  accessibility: number
}

interface PremiumIntelligenceMetricsProps {
  metrics: IntelligenceMetrics
  overallScore?: number
  recommendations?: string[]
}

export function PremiumIntelligenceMetrics({ 
  metrics, 
  overallScore,
  recommendations = []
}: PremiumIntelligenceMetricsProps) {
  const calculatedOverallScore = overallScore || 
    (metrics.novelty + metrics.quality + metrics.performance + metrics.accessibility) / 4

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'success'
    if (score >= 0.7) return 'primary'
    if (score >= 0.5) return 'accent'
    return 'warning'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent'
    if (score >= 0.7) return 'Good'
    if (score >= 0.5) return 'Fair'
    return 'Needs Improvement'
  }

  const metricItems = [
    {
      key: 'novelty',
      label: 'Innovation',
      value: metrics.novelty,
      icon: Brain,
      description: 'Creative and unique design elements',
      color: 'primary'
    },
    {
      key: 'quality',
      label: 'Excellence',
      value: metrics.quality,
      icon: Star,
      description: 'Overall design quality and polish',
      color: 'secondary'
    },
    {
      key: 'performance',
      label: 'Performance',
      value: metrics.performance,
      icon: Zap,
      description: 'Speed and efficiency optimization',
      color: 'accent'
    },
    {
      key: 'accessibility',
      label: 'Accessibility',
      value: metrics.accessibility,
      icon: Shield,
      description: 'Inclusive design and usability',
      color: 'success'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PremiumCard variant="elevated" className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-elevated">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
          
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Intelligence Score</h3>
          <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-1">
            {Math.round(calculatedOverallScore * 100)}
          </div>
          <PremiumBadge 
            variant={getScoreColor(calculatedOverallScore)}
            size="lg"
            glow
            className="text-lg"
          >
            {getScoreLabel(calculatedOverallScore)}
          </PremiumBadge>
        </PremiumCard>
      </motion.div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {metricItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumCard variant="elevated" hover className="p-2 sm:p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 bg-${item.color}-100 rounded-lg flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 text-${item.color}-600`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900">{item.label}</h4>
                    <p className="text-xs text-gray-600 hidden sm:block">{item.description}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700">Score</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(item.value * 100)}
                    </span>
                  </div>
                  
                  <PremiumProgress
                    value={item.value * 100}
                    variant={getScoreColor(item.value)}
                    size="sm"
                    animated
                  />
                  
                  <div className="flex justify-between items-center">
                    <PremiumBadge 
                      variant={getScoreColor(item.value)}
                      size="sm"
                      className="text-xs"
                    >
                      {getScoreLabel(item.value)}
                    </PremiumBadge>
                    <div className="text-xs text-gray-500">
                      {item.value >= 0.9 ? '🎉' : item.value >= 0.7 ? '👍' : item.value >= 0.5 ? '👌' : '⚠️'}
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PremiumCard variant="outlined" className="p-2 sm:p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <h4 className="text-sm font-semibold text-gray-900">AI Recommendations</h4>
            </div>
            
            <div className="space-y-1">
              {recommendations.slice(0, 2).map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-2 p-2 bg-primary-50 rounded"
                >
                  <CheckCircle className="w-3 h-3 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PremiumCard variant="gradient" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
            <h4 className="text-lg font-semibold text-white">Performance Insights</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(calculatedOverallScore * 100)}
              </div>
              <div className="text-sm text-white/80">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(Math.max(...Object.values(metrics)) * 100)}
              </div>
              <div className="text-sm text-white/80">Best Metric</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(Math.min(...Object.values(metrics)) * 100)}
              </div>
              <div className="text-sm text-white/80">Needs Focus</div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  )
}

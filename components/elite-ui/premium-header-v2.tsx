'use client'

import { motion } from "framer-motion"
import { Sparkles, Zap, Brain, Target, Settings, User, Download, Maximize2, Minimize2 } from "lucide-react"
import { PremiumButton } from "@/components/ui/premium-button"
import { PremiumBadge } from "@/components/ui/premium-badge"

interface PremiumHeaderV2Props {
  onDownload?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  hasGeneratedUI?: boolean
}

export function PremiumHeaderV2({ 
  onDownload, 
  onToggleFullscreen, 
  isFullscreen = false,
  hasGeneratedUI = false 
}: PremiumHeaderV2Props) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-hero border-b border-primary-200/20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-premium-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between">
          {/* Logo and branding */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-elevated">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-secondary-500 rounded-full animate-pulse-premium" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Magic UI Studio</h1>
              <p className="text-xs sm:text-sm text-primary-100">Elite AI Design Platform</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {[
              { icon: Brain, label: "AI Engine", active: true, glow: true },
              { icon: Target, label: "Templates", active: false },
              { icon: Zap, label: "Workflows", active: false },
              { icon: Settings, label: "Settings", active: false }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumButton
                  variant={item.active ? "primary" : "ghost"}
                  size="md"
                  glow={item.glow}
                  className={item.active ? "text-white" : "text-primary-100 hover:text-white"}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </PremiumButton>
              </motion.div>
            ))}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {hasGeneratedUI && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block"
              >
                <PremiumButton
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="border-secondary-500 text-secondary-100 hover:bg-secondary-500/10"
                >
                  <Download className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </PremiumButton>
              </motion.div>
            )}
            
            <PremiumButton
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="border-primary-300 text-primary-100 hover:bg-primary-500/10"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </PremiumButton>
            
            <PremiumButton
              variant="ghost"
              size="sm"
              className="text-primary-100 hover:text-white hidden sm:flex"
            >
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </PremiumButton>
            
            <PremiumButton
              variant="secondary"
              size="sm"
              glow
              className="shadow-gold-glow"
            >
              <Zap className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Upgrade Pro</span>
            </PremiumButton>
          </div>
        </div>

        {/* Status bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-success-500 rounded-full animate-pulse-premium" />
              <span className="text-success-100 font-medium text-xs sm:text-sm">AI Engine Online</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full" />
              <span className="text-primary-100 font-medium text-xs sm:text-sm">6 Agents Ready</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 hidden sm:flex"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-secondary-400 rounded-full animate-pulse-premium" />
              <span className="text-secondary-100 font-medium text-sm">Premium Features Active</span>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <PremiumBadge variant="success" size="sm" animated className="hidden sm:flex">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2 animate-pulse-premium" />
              System Healthy
            </PremiumBadge>
            
            <div className="text-primary-200 text-xs sm:text-sm">
              <span className="hidden sm:inline">Last updated: </span>{new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

'use client'

import { motion } from "framer-motion"
import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface PremiumProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'gradient' | 'glow' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animated?: boolean
  label?: string
}

const PremiumProgress = forwardRef<HTMLDivElement, PremiumProgressProps>(
  ({ 
    className,
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    showValue = false,
    animated = true,
    label,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const baseClasses = "relative overflow-hidden rounded-full bg-gray-200"
    
    const sizes = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }
    
    const variants = {
      default: "bg-gradient-primary",
      gradient: "bg-gradient-secondary",
      glow: "bg-gradient-primary shadow-glow",
      pulse: "bg-gradient-primary animate-pulse-premium"
    }
    
    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center">
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
            {showValue && (
              <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(baseClasses, sizes[size], className)}
          {...props}
        >
          <motion.div
            className={cn("h-full rounded-full", variants[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: animated ? 1 : 0,
              ease: "easeOut"
            }}
          />
          
          {animated && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
      </div>
    )
  }
)

PremiumProgress.displayName = "PremiumProgress"

export { PremiumProgress }

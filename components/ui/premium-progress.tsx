'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PremiumProgressProps {
  value: number
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animated?: boolean
  label?: string
  className?: string
}

export function PremiumProgress({ 
  value, 
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = false,
  label,
  className 
}: PremiumProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3", 
    lg: "h-4"
  }
  
  const variantClasses = {
    default: "bg-gray-500",
    primary: "bg-primary-500",
    accent: "bg-accent-500", 
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500"
  }
  
  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs font-medium text-gray-700">{label}</span>}
          {showValue && <span className="text-xs text-gray-500">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variantClasses[variant]
          )}
          initial={animated ? { width: 0 } : { width: `${clampedValue}%` }}
          animate={{ width: `${clampedValue}%` }}
          transition={animated ? { duration: 0.8, ease: "easeOut" } : undefined}
        />
      </div>
    </div>
  )
}

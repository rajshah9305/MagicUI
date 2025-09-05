'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PremiumBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  className?: string
}

export function PremiumBadge({ 
  children, 
  variant = 'default',
  size = 'md',
  glow = false,
  className 
}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    accent: "bg-accent-100 text-accent-800 border-accent-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    error: "bg-error-100 text-error-800 border-error-200",
    outline: "bg-transparent text-gray-600 border-gray-300"
  }
  
  const glowClasses = glow ? "ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/25" : ""
  
  return (
    <motion.span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        glowClasses,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  )
}

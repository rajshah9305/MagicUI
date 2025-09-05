'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  glow?: boolean
  children?: React.ReactNode
}

export function PremiumButton({ 
  className, 
  variant = 'default',
  size = 'md',
  loading = false,
  glow = false,
  disabled,
  children,
  ...props 
}: PremiumButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg"
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
    xl: "px-8 py-3 text-lg"
  }
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 focus:ring-gray-500",
    primary: "bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl",
    secondary: "bg-secondary-500 text-white border border-secondary-500 hover:bg-secondary-600 focus:ring-secondary-500",
    accent: "bg-accent-500 text-white border border-accent-500 hover:bg-accent-600 focus:ring-accent-500",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-500 text-white border border-red-500 hover:bg-red-600 focus:ring-red-500"
  }
  
  const glowClasses = glow ? "ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/25" : ""
  
  return (
    <motion.button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        glowClasses,
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </motion.button>
  )
}

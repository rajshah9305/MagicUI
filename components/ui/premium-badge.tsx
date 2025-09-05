'use client'

import { motion } from "framer-motion"
import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface PremiumBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  animated?: boolean
  icon?: React.ReactNode
}

const PremiumBadge = forwardRef<HTMLDivElement, PremiumBadgeProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    glow = false,
    animated = false,
    icon,
    children,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-300"
    
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-primary-100 text-primary-800 border border-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200",
      accent: "bg-accent-100 text-accent-800 border border-accent-200",
      success: "bg-success-100 text-success-800 border border-success-200",
      warning: "bg-warning-100 text-warning-800 border border-warning-200",
      error: "bg-error-100 text-error-800 border border-error-200",
      outline: "bg-transparent text-gray-700 border-2 border-gray-300"
    }
    
    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base"
    }
    
    const glowClasses = glow ? "hover:shadow-glow" : ""
    const animatedClasses = animated ? "animate-premium-float" : ""
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          animatedClasses,
          className
        )}
        whileHover={{ scale: 1.05 }}
        {...props}
      >
        {icon && (
          <span className="mr-1 flex-shrink-0">{icon}</span>
        )}
        {children}
      </motion.div>
    )
  }
)

PremiumBadge.displayName = "PremiumBadge"

export { PremiumBadge }

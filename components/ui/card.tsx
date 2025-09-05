'use client'

import { motion } from "framer-motion"
import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient'
  hover?: boolean
  glow?: boolean
  float?: boolean
  interactive?: boolean
}

const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    variant = 'default',
    hover = true,
    glow = false,
    float = false,
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "relative rounded-xl transition-all duration-300"
    
    const variants = {
      default: "premium-card",
      elevated: "premium-surface shadow-elevated",
      outlined: "bg-white border-2 border-primary-200 shadow-soft",
      gradient: "premium-gradient text-white shadow-strong"
    }
    
    const hoverClasses = hover ? "hover-lift-premium" : ""
    const glowClasses = glow ? "hover-glow" : ""
    const floatClasses = float ? "animate-premium-float" : ""
    const interactiveClasses = interactive ? "cursor-pointer" : ""
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverClasses,
          glowClasses,
          floatClasses,
          interactiveClasses,
          className
        )}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

PremiumCard.displayName = "PremiumCard"

export { PremiumCard }

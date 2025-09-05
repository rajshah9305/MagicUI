'use client'

import { motion } from "framer-motion"
import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  float?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    glow = false,
    float = false,
    loading = false,
    icon,
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-gradient-primary text-white shadow-soft hover:shadow-medium hover:scale-105 focus:ring-primary-500",
      secondary: "bg-gradient-secondary text-white shadow-soft hover:shadow-medium hover:scale-105 focus:ring-secondary-500",
      accent: "bg-accent-500 text-white shadow-soft hover:shadow-medium hover:scale-105 focus:ring-accent-500",
      ghost: "bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500",
      outline: "border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-lg",
      xl: "px-8 py-4 text-xl rounded-xl"
    }
    
    const glowClasses = glow ? "hover:shadow-glow" : ""
    const floatClasses = float ? "animate-premium-float" : ""
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          floatClasses,
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
      </motion.button>
    )
  }
)

PremiumButton.displayName = "PremiumButton"

export { PremiumButton }

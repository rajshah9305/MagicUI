'use client'

import { motion } from "framer-motion"
import { InputHTMLAttributes, forwardRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    
    const baseClasses = "w-full transition-all duration-300 focus:outline-none"
    
    const variants = {
      default: "bg-surface-elevated border-2 border-border rounded-lg focus:border-primary-500 focus:shadow-glow",
      filled: "bg-primary-50 border-2 border-transparent rounded-lg focus:border-primary-500 focus:shadow-glow",
      outlined: "bg-transparent border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:shadow-glow"
    }
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    }
    
    const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
    
    return (
      <div className="space-y-2">
        {label && (
          <motion.label 
            className="block text-sm font-medium text-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          
          <motion.input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[size],
              iconClasses,
              error && "border-error-500 focus:border-error-500 focus:shadow-none",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-primary-500 pointer-events-none"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {error && (
          <motion.p 
            className="text-sm text-error-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

PremiumInput.displayName = "PremiumInput"

export { PremiumInput }

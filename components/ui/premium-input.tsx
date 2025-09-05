'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined' | 'filled' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  success?: boolean
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function PremiumInput({ 
  className,
  variant = 'default',
  size = 'md',
  error = false,
  success = false,
  label,
  helperText,
  leftIcon,
  rightIcon,
  disabled,
  ...props 
}: PremiumInputProps) {
  const baseClasses = "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg"
  }
  
  const variantClasses = {
    default: "bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500",
    outlined: "bg-transparent border-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500",
    filled: "bg-gray-100 border border-transparent rounded-lg focus:ring-primary-500 focus:bg-white focus:border-primary-500",
    underlined: "bg-transparent border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-primary-500 px-0"
  }
  
  const statusClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : success 
    ? "border-green-500 focus:ring-green-500 focus:border-green-500"
    : ""
  
  const iconPadding = leftIcon ? "pl-10" : rightIcon ? "pr-10" : ""
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <motion.input
          className={cn(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            statusClasses,
            iconPadding,
            className
          )}
          disabled={disabled}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {helperText && (
        <p className={cn(
          "mt-1 text-xs",
          error ? "text-red-600" : success ? "text-green-600" : "text-gray-500"
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}

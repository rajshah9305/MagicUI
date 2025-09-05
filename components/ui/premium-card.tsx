'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
  glow?: boolean
  children?: React.ReactNode
}

export function PremiumCard({ 
  className, 
  variant = 'default', 
  hover = false,
  glow = false,
  children,
  ...props 
}: PremiumCardProps) {
  const baseClasses = "relative rounded-xl border transition-all duration-300"
  
  const variantClasses = {
    default: "bg-white border-gray-200 shadow-sm",
    elevated: "bg-white border-gray-200 shadow-lg",
    outlined: "bg-white border-gray-300 shadow-none",
    glass: "bg-white/80 backdrop-blur-sm border-white/20 shadow-xl"
  }
  
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1" : ""
  const glowClasses = glow ? "ring-2 ring-primary-500/20 shadow-primary-500/25" : ""

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  )
}

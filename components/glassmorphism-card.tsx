"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassmorphismCard({ children, className }: GlassmorphismCardProps) {
  return (
    <motion.div
      className={cn(
        "relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50",
        "hover:bg-white/10 hover:border-white/20 transition-all duration-500",
        className,
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

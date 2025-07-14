"use client"

import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"

interface ComplexityMeterProps {
  value: number
  onChange: (value: number[]) => void
}

export function ComplexityMeter({ value, onChange }: ComplexityMeterProps) {
  const complexityColors = [
    "#ADFF00", // O(1) - Lime
    "#00D1FF", // O(log n) - Cyan
    "#FFD700", // O(n) - Gold
    "#FF8C00", // O(n log n) - Orange
    "#FF2D95", // O(n²) - Pink
    "#FF0000", // O(2ⁿ) - Red
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <Slider value={[value]} onValueChange={onChange} max={5} step={1} className="w-full" />
        <motion.div
          className="absolute top-0 left-0 h-2 rounded-full"
          style={{
            background: `linear-gradient(to right, ${complexityColors.slice(0, value + 1).join(", ")})`,
            width: `${(value / 5) * 100}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400">
        {["Fast", "Good", "Okay", "Slow", "Yikes", "RIP"].map((label, index) => (
          <span key={index} className={value === index ? "text-white font-medium" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"

interface ConfusionMeterProps {
  value: number
  onChange: (value: number) => void
}

export function ConfusionMeter({ value, onChange }: ConfusionMeterProps) {
  const emojis = ["😊", "🤔", "😕", "😵", "🤯"]
  const labels = ["Got it!", "Hmm...", "Confused", "Lost", "Help!"]
  const colors = ["#ADFF00", "#FFD700", "#FF8C00", "#FF2D95", "#FF0000"]

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-slate-400 whitespace-nowrap">Confusion Level:</span>
      <div className="flex items-center space-x-2">
        <motion.div
          className="text-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        >
          {emojis[value]}
        </motion.div>
        <div className="w-24">
          <Slider
            value={[value]}
            onValueChange={(newValue) => onChange(newValue[0])}
            max={4}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-xs text-slate-400 min-w-[50px]" style={{ color: colors[value] }}>
          {labels[value]}
        </span>
      </div>
    </div>
  )
}

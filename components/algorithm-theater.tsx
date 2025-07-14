"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Square, Rabbit, Turtle } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

interface AlgorithmTheaterProps {
  isPlaying: boolean
  onPlayStateChange: (playing: boolean) => void
  memeMode: boolean
}

export function AlgorithmTheater({ isPlaying, onPlayStateChange, memeMode }: AlgorithmTheaterProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState([50])
  const [breakpoints, setBreakpoints] = useState<number[]>([])

  const steps = [
    {
      title: memeMode ? "Initialize the Epic Journey! 🚀" : "Initialize Head Pointer",
      code: "head = new Node(10)",
      description: memeMode ? "Creating our first legendary node!" : "Create the first node in the list",
    },
    {
      title: memeMode ? "Chain the Next Hero! ⛓️" : "Link Second Node",
      code: "head.next = new Node(20)",
      description: memeMode ? "Our first node found its bestie!" : "Connect the second node to the first",
    },
    {
      title: memeMode ? "The Chain Grows Stronger! 💪" : "Add Third Node",
      code: "head.next.next = new Node(30)",
      description: memeMode ? "Three nodes, infinite possibilities!" : "Extend the chain with a third node",
    },
    {
      title: memeMode ? "Traverse Like a Boss! 😎" : "Traverse the List",
      code: "current = head; while(current) { print(current.data); current = current.next; }",
      description: memeMode ? "Walking the chain like we own it!" : "Visit each node in sequence",
    },
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(
        () => {
          setCurrentStep((prev) => {
            const next = (prev + 1) % steps.length
            if (breakpoints.includes(next)) {
              onPlayStateChange(false)
            }
            return next
          })
        },
        2000 - speed[0] * 15,
      )

      return () => clearInterval(interval)
    }
  }, [isPlaying, speed, breakpoints, onPlayStateChange, steps.length])

  const toggleBreakpoint = (stepIndex: number) => {
    setBreakpoints((prev) => (prev.includes(stepIndex) ? prev.filter((bp) => bp !== stepIndex) : [...prev, stepIndex]))
  }

  return (
    <GlassmorphismCard className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{memeMode ? "Algorithm Theater 🎭" : "Algorithm Theater"}</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => onPlayStateChange(!isPlaying)}
              size="sm"
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              onClick={() => setCurrentStep((currentStep + 1) % steps.length)}
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => {
                setCurrentStep(0)
                onPlayStateChange(false)
              }}
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-4">
          <Turtle className="w-4 h-4 text-slate-400" />
          <Slider value={speed} onValueChange={setSpeed} max={100} step={1} className="flex-1" />
          <Rabbit className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400 min-w-[60px]">{speed[0]}% speed</span>
        </div>

        {/* Step Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => toggleBreakpoint(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-cyan-400 scale-125"
                      : breakpoints.includes(index)
                        ? "bg-red-400"
                        : "bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">{steps[currentStep].title}</h4>
                <div className="bg-slate-800 rounded p-3 font-mono text-sm text-cyan-400 mb-3">
                  {steps[currentStep].code}
                </div>
                <p className="text-slate-400 text-sm">{steps[currentStep].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Breakpoints Info */}
        {breakpoints.length > 0 && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-sm">
              <span className="font-semibold">Breakpoints set at steps:</span>{" "}
              {breakpoints.map((bp) => bp + 1).join(", ")}
            </div>
          </div>
        )}
      </div>
    </GlassmorphismCard>
  )
}

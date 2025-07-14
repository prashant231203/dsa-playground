"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, Shuffle, RotateCcw, Zap } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

interface ArrayElement {
  value: number
  id: string
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
}

export function AlgorithmVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [comparing, setComparing] = useState<number[]>([])
  const [swapping, setSwapping] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [speed, setSpeed] = useState(500)

  const generateRandomArray = useCallback(() => {
    const newArray: ArrayElement[] = Array.from({ length: 10 }, (_, index) => ({
      value: Math.floor(Math.random() * 80) + 10,
      id: `element-${index}-${Date.now()}`,
    }))
    setArray(newArray)
    setComparing([])
    setSwapping([])
    setSortedIndices([])
    setCurrentStep(0)
    setTotalSteps(0)
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  useEffect(() => {
    generateRandomArray()
  }, [generateRandomArray])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const bubbleSort = async () => {
    const arr = [...array]
    const n = arr.length
    let steps = 0
    let totalComparisons = 0

    // Calculate total steps for progress
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        totalComparisons++
      }
    }
    setTotalSteps(totalComparisons)

    for (let i = 0; i < n - 1 && isPlaying; i++) {
      for (let j = 0; j < n - i - 1 && isPlaying; j++) {
        if (!isPlaying) return

        // Highlight comparing elements
        setComparing([j, j + 1])
        setCurrentStep(++steps)
        await sleep(speed)

        if (arr[j].value > arr[j + 1].value) {
          // Highlight swapping elements
          setSwapping([j, j + 1])
          await sleep(speed / 2)

          // Swap elements
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr])
          await sleep(speed / 2)

          setSwapping([])
        }

        setComparing([])
        await sleep(speed / 4)
      }

      // Mark the last element as sorted
      setSortedIndices((prev) => [...prev, n - 1 - i])
    }

    // Mark all elements as sorted
    setSortedIndices(Array.from({ length: n }, (_, i) => i))
    setComparing([])
    setSwapping([])
    setIsPlaying(false)
  }

  const handlePlay = async () => {
    if (isPaused) {
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    if (!isPlaying) {
      setIsPlaying(true)
      setIsPaused(false)
      setSortedIndices([])
      await bubbleSort()
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
    setIsPaused(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setIsPaused(false)
    generateRandomArray()
  }

  const maxValue = Math.max(...array.map((el) => el.value))

  return (
    <GlassmorphismCard className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Bubble Sort Visualizer</h3>
            <p className="text-slate-400">Watch the algorithm sort step by step!</p>
          </div>

          <div className="flex items-center space-x-2">
            {!isPlaying && !isPaused && (
              <Button
                onClick={handlePlay}
                className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}

            {isPlaying && (
              <Button
                onClick={handlePause}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}

            {isPaused && (
              <Button
                onClick={handlePlay}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}

            <Button
              onClick={handleReset}
              disabled={isPlaying}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              onClick={generateRandomArray}
              disabled={isPlaying}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {totalSteps > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Visualization */}
        <div className="relative h-80 flex items-end justify-center space-x-2 p-6 bg-slate-900/30 rounded-xl border border-slate-700">
          <AnimatePresence mode="popLayout">
            {array.map((element, index) => {
              const isComparing = comparing.includes(index)
              const isSwapping = swapping.includes(index)
              const isSorted = sortedIndices.includes(index)

              let barColor = "from-slate-600 to-slate-500"
              if (isSorted) {
                barColor = "from-lime-400 to-green-500"
              } else if (isSwapping) {
                barColor = "from-red-500 to-pink-500"
              } else if (isComparing) {
                barColor = "from-yellow-400 to-orange-500"
              } else {
                barColor = "from-cyan-400 to-blue-500"
              }

              return (
                <motion.div
                  key={element.id}
                  className={`relative flex flex-col items-center justify-end transition-all duration-300 bg-gradient-to-t ${barColor} rounded-t-lg`}
                  style={{
                    height: `${(element.value / maxValue) * 250}px`,
                    width: "32px",
                  }}
                  initial={{ scale: 0, y: 20 }}
                  animate={{
                    scale: isComparing || isSwapping ? 1.1 : 1,
                    y: 0,
                    rotateX: isSwapping ? 180 : 0,
                  }}
                  exit={{ scale: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Value label */}
                  <motion.span
                    className="absolute -top-8 text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isComparing || isSwapping ? 1 : 0.7,
                      scale: isComparing || isSwapping ? 1.1 : 1,
                    }}
                  >
                    {element.value}
                  </motion.span>

                  {/* Status indicator */}
                  {(isComparing || isSwapping || isSorted) && (
                    <motion.div
                      className="absolute -bottom-6 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      {isSorted && <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />}
                      {isSwapping && <Zap className="w-3 h-3 text-red-400 animate-bounce" />}
                      {isComparing && !isSwapping && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/30 rounded-lg text-center">
            <div className="text-lg font-bold text-cyan-400">{array.length}</div>
            <div className="text-sm text-slate-400">Elements</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg text-center">
            <div className="text-lg font-bold text-pink-500">O(n²)</div>
            <div className="text-sm text-slate-400">Complexity</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg text-center">
            <div className="text-lg font-bold text-lime-400">{currentStep}</div>
            <div className="text-sm text-slate-400">Comparisons</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg text-center">
            <div className="text-lg font-bold text-yellow-400">
              {comparing.length > 0
                ? `${comparing[0]} ↔ ${comparing[1]}`
                : swapping.length > 0
                  ? "Swapping"
                  : sortedIndices.length === array.length
                    ? "Complete!"
                    : "Ready"}
            </div>
            <div className="text-sm text-slate-400">Status</div>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-slate-400">Speed:</span>
          <div className="flex space-x-2">
            {[
              { label: "Slow", value: 1000 },
              { label: "Normal", value: 500 },
              { label: "Fast", value: 200 },
            ].map((speedOption) => (
              <Button
                key={speedOption.label}
                onClick={() => setSpeed(speedOption.value)}
                variant={speed === speedOption.value ? "default" : "outline"}
                size="sm"
                className={
                  speed === speedOption.value
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                }
              >
                {speedOption.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </GlassmorphismCard>
  )
}

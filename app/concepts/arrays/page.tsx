"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"

export default function ArraysPage() {
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">[]</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Arrays & Strings</h1>
              <p className="text-slate-400">Linear data structures and operations</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">Beginner</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">O(1) Access</Badge>
          </div>
        </motion.div>

        <GlassmorphismCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Array Visualization</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsAnimating(!isAnimating)} className="bg-blue-600 hover:bg-blue-700">
                {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isAnimating ? "Pause" : "Start"} Animation
              </Button>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold"
                  animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5, repeat: isAnimating ? Number.POSITIVE_INFINITY : 0 }}
                >
                  {i * 10}
                </motion.div>
              ))}
            </div>

            <div className="text-center text-slate-400">
              <p>Index-based access allows O(1) retrieval of elements</p>
            </div>
          </div>
        </GlassmorphismCard>

        <div className="flex justify-between items-center mt-8">
          <Link href="/concepts/linked-lists">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous: Linked Lists
            </Button>
          </Link>

          <Link href="/concepts/trees">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Next: Trees & Graphs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

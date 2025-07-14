"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ArrowRight, Zap, Eye } from "lucide-react"

interface Node3D {
  id: string
  value: string
  next: string | null
  x: number
  y: number
  memoryAddress: string
}

interface LinkedListVisualizer3DProps {
  isPlaying: boolean
  memeMode: boolean
}

export function LinkedListVisualizer3D({ isPlaying, memeMode }: LinkedListVisualizer3DProps) {
  const [nodes, setNodes] = useState<Node3D[]>([
    { id: "1", value: "10", next: "2", x: 100, y: 100, memoryAddress: "0x1A2B" },
    { id: "2", value: "20", next: "3", x: 300, y: 100, memoryAddress: "0x3C4D" },
    { id: "3", value: "30", next: null, x: 500, y: 100, memoryAddress: "0x5E6F" },
  ])
  const [newValue, setNewValue] = useState("")
  // const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [showMemory, setShowMemory] = useState(false)
  const [brokenLink, setBrokenLink] = useState<string | null>(null)

  const addNode = () => {
    if (!newValue.trim()) return

    const newNode: Node3D = {
      id: Date.now().toString(),
      value: newValue,
      next: null,
      x: 100 + nodes.length * 200,
      y: 100,
      memoryAddress: `0x${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
    }

    if (nodes.length > 0) {
      const updatedNodes = [...nodes]
      updatedNodes[updatedNodes.length - 1].next = newNode.id
      setNodes([...updatedNodes, newNode])
    } else {
      setNodes([newNode])
    }

    setNewValue("")
  }

  // const removeNode = (_nodeId: string) => {
  //   const nodeIndex = nodes.findIndex((n) => n.id === _nodeId)
  //   if (nodeIndex === -1) return

  //   const updatedNodes = [...nodes]
  //   if (nodeIndex > 0) {
  //     updatedNodes[nodeIndex - 1].next = updatedNodes[nodeIndex].next
  //   }
  //   updatedNodes.splice(nodeIndex, 1)
  //   setNodes(updatedNodes)
  // }

  const createBrokenLink = () => {
    if (nodes.length > 1) {
      const randomIndex = Math.floor(Math.random() * (nodes.length - 1))
      setBrokenLink(nodes[randomIndex].id)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fixBrokenLink = (_nodeId: string) => {
    setBrokenLink(null)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={memeMode ? "Add epic node! 🚀" : "Enter value"}
            className="w-32 bg-slate-800/50 border-slate-600 text-white"
            onKeyPress={(e) => e.key === "Enter" && addNode()}
          />
          <Button
            onClick={addNode}
            className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowMemory(!showMemory)}
            variant="outline"
            size="sm"
            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showMemory ? "Hide" : "Show"} Memory
          </Button>

          <Button
            onClick={createBrokenLink}
            variant="outline"
            size="sm"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            <Zap className="w-4 h-4 mr-2" />
            Break Link
          </Button>
        </div>
      </div>

      {/* 3D Visualization Canvas */}
      <div className="relative h-96 bg-slate-900/30 rounded-xl border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-pink-500/5" />

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00D1FF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Nodes and Connections */}
        <div className="relative w-full h-full p-8">
          <AnimatePresence>
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: hoveredNode === node.id ? 1.1 : 1,
                  y: 0,
                  rotateY: isPlaying ? [0, 360] : 0,
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  rotateY: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${index * 150 + 50}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ scale: 1.1, z: 10 }}
                whileDrag={{ scale: 1.2, zIndex: 50 }}
                drag
                dragConstraints={{ left: 0, right: 400, top: -100, bottom: 100 }}
              >
                {/* Connection Line */}
                {node.next && (
                  <motion.div
                    className={`absolute top-1/2 left-full w-20 h-0.5 ${
                      brokenLink === node.id ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-cyan-400 to-pink-500"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {/* Arrow */}
                    <div
                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 ${
                        brokenLink === node.id ? "border-l-[8px] border-l-red-500" : "border-l-[8px] border-l-pink-500"
                      } border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent`}
                    />

                    {brokenLink === node.id && (
                      <motion.button
                        onClick={() => fixBrokenLink(node.id)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-400 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ⚡
                      </motion.button>
                    )}
                  </motion.div>
                )}

                {/* Node */}
                <div
                  className={`relative ${
                    memeMode
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                      : "bg-gradient-to-r from-cyan-500 to-pink-500"
                  } rounded-xl p-1 shadow-2xl`}
                >
                  <div className="bg-slate-900 rounded-lg p-4 min-w-[80px]">
                    <div className="text-center space-y-2">
                      <div className="text-sm text-slate-400">{memeMode ? "Epic Data" : "Data"}</div>
                      <div className="text-xl font-bold text-white">{node.value}</div>

                      {showMemory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-cyan-400 font-mono border-t border-slate-700 pt-2"
                        >
                          {node.memoryAddress}
                        </motion.div>
                      )}

                      <div className="w-px h-4 bg-slate-600 mx-auto" />

                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1">Next</div>
                        <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center mx-auto">
                          {node.next ? (
                            <ArrowRight className="w-3 h-3 text-slate-900" />
                          ) : (
                            <span className="text-xs text-slate-900">∅</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {/* <Button
                    onClick={() => removeNode(node.id)}
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button> */}

                  {/* Hover Expansion */}
                  <AnimatePresence>
                    {hoveredNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs whitespace-nowrap z-20"
                      >
                        <div className="text-slate-300">
                          {memeMode ? `This node is absolutely legendary! 🔥` : `Memory: ${node.memoryAddress}`}
                        </div>
                        <div className="text-cyan-400">
                          {node.next ? `Points to: ${nodes.find((n) => n.id === node.next)?.value}` : "Tail node"}
                        </div>
                        {/* Arrow pointing up */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-slate-800" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <div className="text-6xl mb-4">🔗</div>
                <p className="text-lg">
                  {memeMode ? "Your list is empty! Time to add some epic nodes! 🚀" : "Your linked list is empty!"}
                </p>
                <p className="text-sm">Add some nodes to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Challenge Section */}
      {brokenLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center space-x-2 text-red-400">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">
              {memeMode
                ? "OH NO! The chain is broken! Fix it to save the day! 🦸‍♂️"
                : "Challenge: Fix the broken link in the visualization!"}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

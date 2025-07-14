"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ArrowRight } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

interface Node {
  id: string
  value: string
  next: string | null
}

export function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", value: "10", next: "2" },
    { id: "2", value: "20", next: "3" },
    { id: "3", value: "30", next: null },
  ])
  const [newValue, setNewValue] = useState("")
  const [draggedNode, setDraggedNode] = useState<string | null>(null)

  const addNode = () => {
    if (!newValue.trim()) return

    const newNode: Node = {
      id: Date.now().toString(),
      value: newValue,
      next: null,
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

  const removeNode = (nodeId: string) => {
    const nodeIndex = nodes.findIndex((n) => n.id === nodeId)
    if (nodeIndex === -1) return

    const updatedNodes = [...nodes]

    // Update the previous node's next pointer
    if (nodeIndex > 0) {
      updatedNodes[nodeIndex - 1].next = updatedNodes[nodeIndex].next
    }

    // Remove the node
    updatedNodes.splice(nodeIndex, 1)
    setNodes(updatedNodes)
  }

  const handleDragStart = (nodeId: string) => {
    setDraggedNode(nodeId)
  }

  const handleDragEnd = () => {
    setDraggedNode(null)
  }

  return (
    <GlassmorphismCard className="p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Interactive Linked List</h2>
            <p className="text-slate-400">Drag nodes around and see how they connect!</p>
          </div>

          <div className="flex items-center space-x-3">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value"
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
        </div>

        <div className="relative min-h-[300px] bg-slate-900/30 rounded-xl border border-slate-700 p-8 overflow-x-auto">
          <div className="flex items-center space-x-8 min-w-max">
            <AnimatePresence>
              {nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  {/* Node */}
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: -50, bottom: 50 }}
                    onDragStart={() => handleDragStart(node.id)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    className={`relative group cursor-grab active:cursor-grabbing ${
                      draggedNode === node.id ? "z-10" : ""
                    }`}
                  >
                    <div className="flex items-center bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl p-1">
                      <div className="bg-slate-900 rounded-lg p-4 flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-sm text-slate-400 mb-1">Data</div>
                          <div className="text-xl font-bold text-white">{node.value}</div>
                        </div>

                        <div className="w-px h-8 bg-slate-600"></div>

                        <div className="text-center">
                          <div className="text-sm text-slate-400 mb-1">Next</div>
                          <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                            {node.next ? (
                              <ArrowRight className="w-3 h-3 text-slate-900" />
                            ) : (
                              <span className="text-xs text-slate-900">∅</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => removeNode(node.id)}
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </motion.div>

                  {/* Arrow */}
                  {node.next && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      className="flex items-center"
                    >
                      <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500"></div>
                      <div className="w-0 h-0 border-l-[8px] border-l-pink-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {nodes.length === 0 && (
              <div className="text-center text-slate-400 py-16">
                <div className="text-6xl mb-4">🔗</div>
                <p className="text-lg">Your linked list is empty!</p>
                <p className="text-sm">Add some nodes to get started</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Operations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Insert at end:</span>
                <span className="text-lime-400 font-mono">O(n)</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Delete node:</span>
                <span className="text-yellow-400 font-mono">O(n)</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Search:</span>
                <span className="text-red-400 font-mono">O(n)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Pro Tips</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Always check if a node exists before accessing it</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Keep track of the head pointer - it&apos;s your entry point</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-lime-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Use two pointers for advanced operations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassmorphismCard>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, CheckCircle } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

export function CodeLab() {
  const [code, setCode] = useState(`class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, val):
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def display(self):
        result = []
        current = self.head
        while current:
            result.append(current.val)
            current = current.next
        return result

# Try it out!
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
print(ll.display())  # [10, 20, 30]`)

  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOutput("[10, 20, 30]\n\nNice work! Your linked list is working perfectly! 🎉")
    setIsRunning(false)
  }

  const resetCode = () => {
    setOutput("")
  }

  return (
    <div className="space-y-6">
      <GlassmorphismCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Code Playground</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-black font-semibold"
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button
              onClick={resetCode}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-sm text-slate-400 mb-2">Python Implementation</div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-white resize-none focus:outline-none focus:border-cyan-400"
                spellCheck={false}
              />
              <div className="absolute top-2 right-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-slate-400 mb-2">Output</div>
            <div className="h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-white overflow-auto">
              {output ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="flex items-center space-x-2 text-green-400 mb-4">
                    <CheckCircle className="w-4 h-4" />
                    <span>Code executed successfully!</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </motion.div>
              ) : (
                <div className="text-slate-500 italic">Click &quot;Run Code&quot; to see the output...</div>
              )}
            </div>
          </div>
        </div>
      </GlassmorphismCard>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassmorphismCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Challenge Yourself!</h3>
          <div className="space-y-3">
            {[
              { task: "Add a method to insert at the beginning", difficulty: "Easy", points: 10 },
              { task: "Implement a method to reverse the list", difficulty: "Medium", points: 25 },
              { task: "Find the middle element in one pass", difficulty: "Hard", points: 50 },
            ].map((challenge, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-white font-medium">{challenge.task}</div>
                  <div className="text-sm text-slate-400">{challenge.difficulty}</div>
                </div>
                <div className="text-lime-400 font-bold">{challenge.points} XP</div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Reference</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-cyan-400 font-mono mb-1">node.next</div>
              <div className="text-slate-400">Access the next node</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-pink-500 font-mono mb-1">while current:</div>
              <div className="text-slate-400">Traverse the list</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-lime-400 font-mono mb-1">current = current.next</div>
              <div className="text-slate-400">Move to next node</div>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  )
}

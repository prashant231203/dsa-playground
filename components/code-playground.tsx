"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, CheckCircle, Brain, Lightbulb, Bug } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

interface CodePlaygroundProps {
  memeMode: boolean
}

export function CodePlayground({ memeMode }: CodePlaygroundProps) {
  const [activeChallenge, setActiveChallenge] = useState(0)
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
        
        # TODO: Complete this method
        # Hint: Traverse to the end and link the new node
        pass
    
    def display(self):
        result = []
        current = self.head
        while current:
            result.append(current.val)
            current = current.next
        return result

# Test your implementation
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.append(30)
print(ll.display())`)

  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const challenges = [
    {
      title: memeMode ? "Complete the Epic Append! 🚀" : "Complete the Append Method",
      difficulty: "Easy",
      points: 25,
      description: memeMode
        ? "Help our linked list grow by adding nodes like a boss! Fill in the missing code to make the magic happen! ✨"
        : "Fill in the missing code to complete the append method that adds nodes to the end of the list.",
      hint: "You need to traverse to the last node (where next is None) and set its next pointer to the new node.",
      solution: `current = self.head
while current.next:
    current = current.next
current.next = new_node`,
    },
    {
      title: memeMode ? "Prepend Like a Pro! ⚡" : "Implement Prepend Method",
      difficulty: "Medium",
      points: 50,
      description: memeMode
        ? "Add nodes to the front like you're cutting in line! But in a good way! 😄"
        : "Create a method that adds a new node at the beginning of the linked list.",
      hint: "The new node should become the new head, and its next should point to the old head.",
      solution: `def prepend(self, val):
    new_node = ListNode(val)
    new_node.next = self.head
    self.head = new_node`,
    },
    {
      title: memeMode ? "Delete Node Like a Ninja! 🥷" : "Implement Node Deletion",
      difficulty: "Hard",
      points: 100,
      description: memeMode
        ? "Remove nodes with stealth and precision! Don't break the chain! 🔗"
        : "Create a method that removes a node with a specific value from the linked list.",
      hint: "You need to handle edge cases: deleting the head, and updating the previous node's next pointer.",
      solution: `def delete(self, val):
    if not self.head:
        return
    if self.head.val == val:
        self.head = self.head.next
        return
    current = self.head
    while current.next and current.next.val != val:
        current = current.next
    if current.next:
        current.next = current.next.next`,
    },
  ]

  const runCode = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = Math.random() > 0.3 // 70% success rate for demo

    if (success) {
      setOutput(
        memeMode
          ? `[10, 20, 30]\n\n🎉 LEGENDARY! Your code is absolutely fire! You're basically a linked list wizard now! ⚡\n\n+${challenges[activeChallenge].points} XP earned!`
          : `[10, 20, 30]\n\nSuccess! Your linked list implementation works perfectly! 🎉\n\n+${challenges[activeChallenge].points} XP earned!`,
      )
    } else {
      setOutput(
        memeMode
          ? `AttributeError: 'NoneType' object has no attribute 'next'\n\n😅 Oops! Looks like we hit a snag! Don't worry, even the best coders debug their way to greatness! 💪\n\nHint: Check if you're handling the traversal correctly!`
          : `AttributeError: 'NoneType' object has no attribute 'next'\n\nError in your implementation. Check the hint for guidance! 🤔`,
      )
    }

    setIsRunning(false)
  }

  const resetCode = () => {
    setOutput("")
    setShowHint(false)
  }

  return (
    <GlassmorphismCard className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{memeMode ? "Code Playground 🎮" : "Dynamic Code Lab"}</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-400/30">
              AI-Powered
            </Badge>
            <Badge variant="outline" className="border-lime-400/30 text-lime-400">
              Live Execution
            </Badge>
          </div>
        </div>

        {/* Challenge Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {challenges.map((challenge, index) => (
            <button
              key={index}
              onClick={() => setActiveChallenge(index)}
              className={`flex-shrink-0 p-3 rounded-lg border transition-all duration-300 ${
                activeChallenge === index
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                  : "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              }`}
            >
              <div className="text-sm font-medium">{challenge.title}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className={`text-xs ${
                    challenge.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400 border-green-400/30"
                      : challenge.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                        : "bg-red-500/20 text-red-400 border-red-400/30"
                  }`}
                >
                  {challenge.difficulty}
                </Badge>
                <span className="text-xs text-lime-400">{challenge.points} XP</span>
              </div>
            </button>
          ))}
        </div>

        {/* Challenge Description */}
        <motion.div
          key={activeChallenge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
        >
          <p className="text-slate-300">{challenges[activeChallenge].description}</p>
        </motion.div>

        {/* Code Editor and Output */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">Python Implementation</div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowHint(!showHint)}
                  size="sm"
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? "Hide" : "Show"} Hint
                </Button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-white resize-none focus:outline-none focus:border-cyan-400 transition-colors"
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

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-semibold">Hint</span>
                  </div>
                  <p className="text-slate-300 text-sm">{challenges[activeChallenge].hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">Output</div>
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
                  {isRunning ? (memeMode ? "Cooking..." : "Running...") : memeMode ? "Run Epic Code!" : "Run Code"}
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

            <div className="h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-white overflow-auto">
              {output ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  {output.includes("Success") || output.includes("LEGENDARY") ? (
                    <div className="flex items-center space-x-2 text-green-400 mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span>Code executed successfully!</span>
                    </div>
                  ) : output.includes("Error") || output.includes("Oops") ? (
                    <div className="flex items-center space-x-2 text-red-400 mb-4">
                      <Bug className="w-4 h-4" />
                      <span>Debug time!</span>
                    </div>
                  ) : null}
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </motion.div>
              ) : (
                <div className="text-slate-500 italic">
                  {memeMode
                    ? "Click 'Run Epic Code!' to see the magic happen! ✨"
                    : "Click 'Run Code' to see the output..."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Nudge Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10 bg-transparent"
          >
            <Brain className="w-4 h-4 mr-2" />
            {memeMode ? "AI Buddy, Help Me Out! 🤖" : "Get AI Nudge"}
          </Button>
        </div>
      </div>
    </GlassmorphismCard>
  )
}

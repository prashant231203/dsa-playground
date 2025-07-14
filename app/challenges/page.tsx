"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Clock, Trophy, Star } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"

export default function ChallengesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const challenges = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      timeLimit: "15 min",
      points: 100,
      solved: true,
      description: "Find two numbers in an array that add up to a target sum",
    },
    {
      id: 2,
      title: "Reverse Linked List",
      difficulty: "Medium",
      category: "Linked Lists",
      timeLimit: "20 min",
      points: 200,
      solved: false,
      description: "Reverse a singly linked list iteratively and recursively",
    },
    {
      id: 3,
      title: "Binary Tree Traversal",
      difficulty: "Medium",
      category: "Trees",
      timeLimit: "25 min",
      points: 250,
      solved: false,
      description: "Implement inorder, preorder, and postorder traversals",
    },
    {
      id: 4,
      title: "Graph Shortest Path",
      difficulty: "Hard",
      category: "Graphs",
      timeLimit: "45 min",
      points: 500,
      solved: false,
      description: "Find shortest path between two nodes using Dijkstra's algorithm",
    },
  ]

  const filteredChallenges =
    selectedDifficulty === "all"
      ? challenges
      : challenges.filter((c) => c.difficulty.toLowerCase() === selectedDifficulty)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Coding Challenges</h1>
          <p className="text-slate-400 text-lg">Practice with real interview questions</p>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8">
          {["all", "easy", "medium", "hard"].map((difficulty) => (
            <Button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              className={
                selectedDifficulty === difficulty
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-600 text-slate-300 hover:bg-slate-800"
              }
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphismCard className="p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                      <Badge
                        className={`${
                          challenge.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400 border-green-400/30"
                            : challenge.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                              : "bg-red-500/20 text-red-400 border-red-400/30"
                        }`}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {challenge.category}
                      </Badge>
                      {challenge.solved && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                          <Trophy className="w-3 h-3 mr-1" />
                          Solved
                        </Badge>
                      )}
                    </div>

                    <p className="text-slate-400 mb-4">{challenge.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.timeLimit}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{challenge.points} points</span>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Code className="w-4 h-4 mr-2" />
                    {challenge.solved ? "Review" : "Solve"}
                  </Button>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

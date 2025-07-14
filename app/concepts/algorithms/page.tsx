"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Play, BookOpen, Code, Zap, Clock, Cpu } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"

export default function AlgorithmsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  // const [isAnimating, setIsAnimating] = useState(false)

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "sorting", label: "Sorting", icon: Play },
    { id: "searching", label: "Searching", icon: Code },
    { id: "practice", label: "Practice", icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Algorithms
                  </span>
                </h1>
                <p className="text-2xl text-slate-400">Sorting, searching, and optimization techniques</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500/20 text-red-400 border-red-400/30 px-4 py-2 text-lg">Advanced</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 px-4 py-2 text-lg">
                <Clock className="w-4 h-4 mr-2" />
                60 min
              </Badge>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Quick Sort", value: "O(n log n)", color: "text-green-400", desc: "Average case" },
              { label: "Binary Search", value: "O(log n)", color: "text-blue-400", desc: "Sorted array" },
              { label: "Merge Sort", value: "O(n log n)", color: "text-purple-400", desc: "Guaranteed" },
              { label: "Linear Search", value: "O(n)", color: "text-yellow-400", desc: "Unsorted array" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GlassmorphismCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.desc}</div>
                </GlassmorphismCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-slate-800/50 p-2 rounded-2xl border border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex-1 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-lg">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <GlassmorphismCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Algorithm Fundamentals</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-lg text-slate-300 leading-relaxed">
                      Algorithmsep proceds for solving computational problems. They form the
                      foundation of efficient programming and problem-solving.
                    </p>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Algorithm Categories:</h3>
                      <ul className="space-y-3">
                        {[
                          "Sorting - Arrange data in specific order",
                          "Searching - Find specific elements in data",
                          "Graph algorithms - Navigate and analyze networks",
                          "Dynamic programming - Optimize recursive solutions",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Big-O Complexity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                        <span className="text-green-400">O(1)</span>
                        <span className="text-slate-300">Constant</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                        <span className="text-blue-400">O(log n)</span>
                        <span className="text-slate-300">Logarithmic</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded">
                        <span className="text-yellow-400">O(n)</span>
                        <span className="text-slate-300">Linear</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-500/10 rounded">
                        <span className="text-orange-400">O(n log n)</span>
                        <span className="text-slate-300">Linearithmic</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-500/10 rounded">
                        <span className="text-red-400">O(n²)</span>
                        <span className="text-slate-300">Quadratic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}

          {activeTab === "sorting" && (
            <motion.div
              key="sorting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <GlassmorphismCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Sorting Algorithms</h2>

                <div className="grid gap-6">
                  {[
                    {
                      name: "Bubble Sort",
                      complexity: "O(n²)",
                      space: "O(1)",
                      description: "Repeatedly swaps adjacent elements if they're in wrong order",
                      stable: true,
                      color: "text-red-400",
                    },
                    {
                      name: "Quick Sort",
                      complexity: "O(n log n)",
                      space: "O(log n)",
                      description: "Divide-and-conquer using pivot partitioning",
                      stable: false,
                      color: "text-green-400",
                    },
                    {
                      name: "Merge Sort",
                      complexity: "O(n log n)",
                      space: "O(n)",
                      description: "Divide array and merge sorted halves",
                      stable: true,
                      color: "text-blue-400",
                    },
                    {
                      name: "Heap Sort",
                      complexity: "O(n log n)",
                      space: "O(1)",
                      description: "Uses binary heap data structure",
                      stable: false,
                      color: "text-purple-400",
                    },
                  ].map((algo, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-purple-400/30 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">{algo.name}</h3>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={`${algo.color.replace("text-", "bg-").replace("400", "500/20")} ${algo.color} border-${algo.color.replace("text-", "").replace("400", "400/30")}`}
                          >
                            {algo.complexity}
                          </Badge>
                          <Badge className="bg-slate-600/20 text-slate-400 border-slate-400/30">
                            Space: {algo.space}
                          </Badge>
                          {algo.stable && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">Stable</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-400">{algo.description}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}

          {activeTab === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <GlassmorphismCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Searching Algorithms</h2>

                <div className="space-y-8">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Binary Search Implementation</h3>
                    <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                      <code>{`function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Time: O(log n), Space: O(1)`}</code>
                    </pre>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        name: "Linear Search",
                        complexity: "O(n)",
                        description: "Check each element sequentially",
                        useCase: "Unsorted arrays, small datasets",
                      },
                      {
                        name: "Binary Search",
                        complexity: "O(log n)",
                        description: "Divide and conquer on sorted arrays",
                        useCase: "Sorted arrays, large datasets",
                      },
                    ].map((search, index) => (
                      <motion.div
                        key={index}
                        className="p-6 bg-slate-800/30 rounded-xl border border-slate-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <h3 className="text-lg font-bold text-white mb-2">{search.name}</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-3">
                          {search.complexity}
                        </Badge>
                        <p className="text-slate-400 mb-2">{search.description}</p>
                        <p className="text-sm text-slate-500 italic">{search.useCase}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}

          {activeTab === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <GlassmorphismCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Algorithm Practice</h2>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Two Sum",
                      difficulty: "Easy",
                      description: "Find two numbers that add up to a target sum",
                      topics: ["Array", "Hash Table", "Two Pointers"],
                      time: "15 min",
                    },
                    {
                      title: "Merge Intervals",
                      difficulty: "Medium",
                      description: "Merge overlapping intervals in an array",
                      topics: ["Array", "Sorting", "Intervals"],
                      time: "25 min",
                    },
                    {
                      title: "Quick Select",
                      difficulty: "Medium",
                      description: "Find the kth largest element in an array",
                      topics: ["Divide & Conquer", "Sorting", "Selection"],
                      time: "30 min",
                    },
                    {
                      title: "Longest Increasing Subsequence",
                      difficulty: "Hard",
                      description: "Find length of longest increasing subsequence",
                      topics: ["Dynamic Programming", "Binary Search"],
                      time: "45 min",
                    },
                  ].map((problem, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-purple-400/30 transition-all duration-300 hover:scale-[1.02]"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
                          <p className="text-slate-400 mb-3">{problem.description}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge
                            className={`${
                              problem.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400 border-green-400/30"
                                : problem.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                                  : "bg-red-500/20 text-red-400 border-red-400/30"
                            }`}
                          >
                            {problem.difficulty}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">{problem.time}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {problem.topics.map((topic, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Solve Problem
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-800">
          <Link href="/concepts/trees">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent group px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous: Trees & Graphs
            </Button>
          </Link>

          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group px-8 py-3">
              Test Your Knowledge
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

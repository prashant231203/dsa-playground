"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Play, Pause, BookOpen, Code, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"

export default function LinkedListsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnimating, setIsAnimating] = useState(false)

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "visualization", label: "Visualization", icon: Play },
    { id: "implementation", label: "Code", icon: Code },
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-white text-2xl font-bold">🔗</div>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Linked Lists
                  </span>
                </h1>
                <p className="text-2xl text-slate-400">Dynamic data structures with pointer connections</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 px-4 py-2 text-lg">Beginner</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 px-4 py-2 text-lg">
                <Clock className="w-4 h-4 mr-2" />
                30 min
              </Badge>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Time Complexity", value: "O(n)", color: "text-yellow-400", desc: "Linear access" },
              { label: "Space Complexity", value: "O(1)", color: "text-green-400", desc: "Constant extra space" },
              { label: "Insert/Delete", value: "O(1)", color: "text-green-400", desc: "At known position" },
              { label: "Memory", value: "Dynamic", color: "text-blue-400", desc: "Grows as needed" },
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
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
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
                <h2 className="text-3xl font-bold mb-6 text-white">What are Linked Lists?</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-lg text-slate-300 leading-relaxed">
                      A linked list is a linear data structure where elements are stored in nodes. Each node contains
                      data and a reference (or link) to the next node in the sequence.
                    </p>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Key Characteristics:</h3>
                      <ul className="space-y-3">
                        {[
                          "Dynamic size - grows and shrinks during runtime",
                          "Non-contiguous memory allocation",
                          "Efficient insertion and deletion at known positions",
                          "Sequential access only - no random access",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Node Structure</h3>
                    <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                      <code>{`class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

// Creating nodes
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);`}</code>
                    </pre>
                  </div>
                </div>
              </GlassmorphismCard>

              <div className="grid md:grid-cols-2 gap-8">
                <GlassmorphismCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 text-green-400">✅ Advantages</h3>
                  <ul className="space-y-3">
                    {[
                      "Dynamic size allocation",
                      "Efficient insertion/deletion",
                      "Memory efficient for sparse data",
                      "No memory waste",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphismCard>

                <GlassmorphismCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 text-red-400">❌ Disadvantages</h3>
                  <ul className="space-y-3">
                    {[
                      "No random access to elements",
                      "Extra memory for storing pointers",
                      "Not cache-friendly",
                      "Sequential access only",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphismCard>
              </div>
            </motion.div>
          )}

          {activeTab === "visualization" && (
            <motion.div
              key="visualization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphismCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Interactive Visualization</h2>
                  <Button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3"
                  >
                    {isAnimating ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isAnimating ? "Pause" : "Start"} Animation
                  </Button>
                </div>

                {/* Linked List Visualization */}
                <div className="relative h-80 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden mb-8">
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                    <div className="flex items-center space-x-12">
                      {[
                        { value: "10", address: "0x1A2B" },
                        { value: "20", address: "0x3C4D" },
                        { value: "30", address: "0x5E6F" },
                      ].map((node, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: isAnimating ? [0, -15, 0] : 0,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.2,
                            y: {
                              duration: 2,
                              repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
                              delay: index * 0.4,
                            },
                          }}
                        >
                          {/* Node */}
                          <div className="relative group">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
                              <div className="bg-slate-900 rounded-xl p-6 min-w-[120px]">
                                <div className="text-center space-y-3">
                                  <div className="text-sm text-slate-400 font-medium">Data</div>
                                  <div className="text-3xl font-bold text-white">{node.value}</div>
                                  <div className="w-full h-px bg-slate-600 my-3"></div>
                                  <div className="text-center">
                                    <div className="text-sm text-slate-400 font-medium mb-2">Next</div>
                                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                                      {index < 2 ? (
                                        <ArrowRight className="w-4 h-4 text-white" />
                                      ) : (
                                        <span className="text-sm text-white font-bold">∅</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hover tooltip */}
                            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                              <div className="text-white font-medium">Memory: {node.address}</div>
                              <div className="text-cyan-400">
                                {index < 2 ? `Points to next node` : "Tail node (null)"}
                              </div>
                            </div>
                          </div>

                          {/* Arrow */}
                          {index < 2 && (
                            <motion.div
                              className="flex items-center"
                              animate={isAnimating ? { x: [0, 15, 0] } : {}}
                              transition={{ duration: 1.5, repeat: isAnimating ? Number.POSITIVE_INFINITY : 0 }}
                            >
                              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
                              <div className="w-0 h-0 border-l-[12px] border-l-purple-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Operations Complexity */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      operation: "Access/Search",
                      complexity: "O(n)",
                      color: "text-yellow-400",
                      description: "Must traverse from head to target",
                      example: "Finding element at index 5",
                    },
                    {
                      operation: "Insertion",
                      complexity: "O(1)",
                      color: "text-green-400",
                      description: "Constant time at known position",
                      example: "Insert at head or known node",
                    },
                    {
                      operation: "Deletion",
                      complexity: "O(1)",
                      color: "text-green-400",
                      description: "Constant time with node reference",
                      example: "Delete node with pointer",
                    },
                  ].map((op, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-white text-lg">{op.operation}</span>
                        <span className={`font-mono text-2xl ${op.color} font-bold`}>{op.complexity}</span>
                      </div>
                      <p className="text-slate-400 mb-2">{op.description}</p>
                      <p className="text-sm text-slate-500 italic">{op.example}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}

          {activeTab === "implementation" && (
            <motion.div
              key="implementation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <GlassmorphismCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Implementation Examples</h2>

                <div className="space-y-8">
                  {/* Basic Operations */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Basic Linked List Operations</h3>
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                        <code>{`class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at beginning - O(1)
    prepend(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Insert at end - O(n)
    append(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    // Delete by value - O(n)
    delete(val) {
        if (!this.head) return false;
        
        if (this.head.val === val) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.val !== val) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        return false;
    }
    
    // Search - O(n)
    find(val) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.val === val) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Common Patterns */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Common Interview Patterns</h3>
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                        <code>{`// Two Pointer Technique
function findMiddle(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}

// Reverse Linked List
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

// Detect Cycle (Floyd's Algorithm)
function hasCycle(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    return false;
}`}</code>
                      </pre>
                    </div>
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
                <h2 className="text-3xl font-bold mb-6 text-white">Practice Problems</h2>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Reverse Linked List",
                      difficulty: "Easy",
                      description: "Reverse a singly linked list iteratively and recursively",
                      topics: ["Pointers", "Iteration", "Recursion"],
                      time: "15 min",
                    },
                    {
                      title: "Merge Two Sorted Lists",
                      difficulty: "Easy",
                      description: "Merge two sorted linked lists into one sorted list",
                      topics: ["Two Pointers", "Sorting", "Merging"],
                      time: "20 min",
                    },
                    {
                      title: "Linked List Cycle",
                      difficulty: "Medium",
                      description: "Detect if a linked list has a cycle using Floyd's algorithm",
                      topics: ["Two Pointers", "Cycle Detection", "Fast-Slow"],
                      time: "25 min",
                    },
                    {
                      title: "Remove Nth Node From End",
                      difficulty: "Medium",
                      description: "Remove the nth node from the end of a linked list",
                      topics: ["Two Pointers", "Edge Cases", "One Pass"],
                      time: "20 min",
                    },
                  ].map((problem, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.02]"
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
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
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

                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
          <Link href="/concepts/arrays">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent group px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous: Arrays
            </Button>
          </Link>

          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group px-8 py-3">
              Test Your Knowledge
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

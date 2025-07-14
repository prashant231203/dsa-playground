"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Play, Pause, BookOpen, Code, Zap, Clock, TreePine } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"

export default function TreesPage() {
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <TreePine className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Trees & Graphs
                  </span>
                </h1>
                <p className="text-2xl text-slate-400">Hierarchical and network data structures</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 px-4 py-2 text-lg">
                Intermediate
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 px-4 py-2 text-lg">
                <Clock className="w-4 h-4 mr-2" />
                45 min
              </Badge>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Tree Traversal", value: "O(n)", color: "text-green-400", desc: "Visit all nodes" },
              { label: "BST Search", value: "O(log n)", color: "text-blue-400", desc: "Balanced tree" },
              { label: "Graph BFS/DFS", value: "O(V+E)", color: "text-purple-400", desc: "Vertices + Edges" },
              { label: "Space Usage", value: "O(h)", color: "text-orange-400", desc: "Height dependent" },
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
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105"
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
                <h2 className="text-3xl font-bold mb-6 text-white">What are Trees?</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <p className="text-lg text-slate-300 leading-relaxed">
                      A tree is a hierarchical data structure consisting of nodes connected by edges. Each tree has a
                      root node and zero or more subtrees.
                    </p>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Key Characteristics:</h3>
                      <ul className="space-y-3">
                        {[
                          "Hierarchical structure with parent-child relationships",
                          "No cycles - exactly one path between any two nodes",
                          "Root node has no parent, leaf nodes have no children",
                          "Efficient for searching, insertion, and deletion",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Binary Tree Node</h3>
                    <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                      <code>{`class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// Creating a binary tree
let root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);`}</code>
                    </pre>
                  </div>
                </div>
              </GlassmorphismCard>

              <div className="grid md:grid-cols-2 gap-8">
                <GlassmorphismCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 text-green-400">🌳 Tree Types</h3>
                  <ul className="space-y-3">
                    {[
                      "Binary Tree - Each node has at most 2 children",
                      "Binary Search Tree - Left < Root < Right",
                      "AVL Tree - Self-balancing binary search tree",
                      "Heap - Complete binary tree with heap property",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphismCard>

                <GlassmorphismCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 text-blue-400">🕸️ Graph Types</h3>
                  <ul className="space-y-3">
                    {[
                      "Directed Graph - Edges have direction",
                      "Undirected Graph - Bidirectional edges",
                      "Weighted Graph - Edges have weights/costs",
                      "Cyclic/Acyclic - Contains cycles or not",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
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
                  <h2 className="text-3xl font-bold text-white">Binary Tree Visualization</h2>
                  <Button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3"
                  >
                    {isAnimating ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isAnimating ? "Pause" : "Start"} Traversal
                  </Button>
                </div>

                {/* Binary Tree Visualization */}
                <div className="relative h-96 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden mb-8">
                  <div className="relative w-full h-full p-8">
                    {/* Tree Structure */}
                    <svg className="absolute inset-0 w-full h-full">
                      {/* Tree Edges */}
                      <g stroke="#64748b" strokeWidth="2">
                        <line x1="50%" y1="20%" x2="30%" y2="40%" />
                        <line x1="50%" y1="20%" x2="70%" y2="40%" />
                        <line x1="30%" y1="40%" x2="20%" y2="60%" />
                        <line x1="30%" y1="40%" x2="40%" y2="60%" />
                        <line x1="70%" y1="40%" x2="60%" y2="60%" />
                        <line x1="70%" y1="40%" x2="80%" y2="60%" />
                      </g>
                    </svg>

                    {/* Tree Nodes */}
                    {[
                      { value: "1", x: "50%", y: "20%", level: 0 },
                      { value: "2", x: "30%", y: "40%", level: 1 },
                      { value: "3", x: "70%", y: "40%", level: 1 },
                      { value: "4", x: "20%", y: "60%", level: 2 },
                      { value: "5", x: "40%", y: "60%", level: 2 },
                      { value: "6", x: "60%", y: "60%", level: 2 },
                      { value: "7", x: "80%", y: "60%", level: 2 },
                    ].map((node, index) => (
                      <motion.div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: node.x, top: node.y }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          backgroundColor: isAnimating ? ["#1e293b", "#10b981", "#1e293b"] : "#1e293b",
                        }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.2,
                          backgroundColor: {
                            duration: 2,
                            repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
                            delay: index * 0.5,
                          },
                        }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20">
                          {node.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Traversal Methods */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      method: "In-Order",
                      sequence: "4, 2, 5, 1, 6, 3, 7",
                      description: "Left → Root → Right",
                      useCase: "Get sorted sequence from BST",
                    },
                    {
                      method: "Pre-Order",
                      sequence: "1, 2, 4, 5, 3, 6, 7",
                      description: "Root → Left → Right",
                      useCase: "Copy/serialize tree structure",
                    },
                    {
                      method: "Post-Order",
                      sequence: "4, 5, 2, 6, 7, 3, 1",
                      description: "Left → Right → Root",
                      useCase: "Delete tree or calculate size",
                    },
                  ].map((traversal, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-green-400/30 transition-all duration-300 hover:scale-105"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="font-bold text-white text-lg mb-2">{traversal.method}</h3>
                      <p className="text-green-400 font-mono text-sm mb-2">{traversal.sequence}</p>
                      <p className="text-slate-400 text-sm mb-2">{traversal.description}</p>
                      <p className="text-xs text-slate-500 italic">{traversal.useCase}</p>
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
                <h2 className="text-3xl font-bold mb-6 text-white">Tree Implementation</h2>

                <div className="space-y-8">
                  {/* Binary Search Tree */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Binary Search Tree Operations</h3>
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                        <code>{`class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }
    
    // Insert - O(log n) average, O(n) worst
    insert(val) {
        this.root = this.insertHelper(this.root, val);
    }
    
    insertHelper(node, val) {
        if (!node) return new TreeNode(val);
        
        if (val < node.val) {
            node.left = this.insertHelper(node.left, val);
        } else if (val > node.val) {
            node.right = this.insertHelper(node.right, val);
        }
        return node;
    }
    
    // Search - O(log n) average, O(n) worst
    search(val) {
        return this.searchHelper(this.root, val);
    }
    
    searchHelper(node, val) {
        if (!node || node.val === val) return node;
        
        if (val < node.val) {
            return this.searchHelper(node.left, val);
        }
        return this.searchHelper(node.right, val);
    }
    
    // In-order traversal - O(n)
    inOrder() {
        const result = [];
        this.inOrderHelper(this.root, result);
        return result;
    }
    
    inOrderHelper(node, result) {
        if (node) {
            this.inOrderHelper(node.left, result);
            result.push(node.val);
            this.inOrderHelper(node.right, result);
        }
    }
}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Graph Algorithms */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Graph Traversal Algorithms</h3>
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                      <pre className="text-cyan-400 text-sm font-mono overflow-x-auto">
                        <code>{`// Depth-First Search (DFS)
function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start);
    
    for (let neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}

// Breadth-First Search (BFS)
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node);
        
        for (let neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}

// Example usage
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};

dfs(graph, 'A'); // A, B, D, E, F, C
bfs(graph, 'A'); // A, B, C, D, E, F`}</code>
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
                      title: "Binary Tree Inorder Traversal",
                      difficulty: "Easy",
                      description: "Return the inorder traversal of a binary tree's node values",
                      topics: ["Tree Traversal", "Recursion", "Stack"],
                      time: "15 min",
                    },
                    {
                      title: "Maximum Depth of Binary Tree",
                      difficulty: "Easy",
                      description: "Find the maximum depth of a binary tree",
                      topics: ["Tree", "DFS", "Recursion"],
                      time: "10 min",
                    },
                    {
                      title: "Validate Binary Search Tree",
                      difficulty: "Medium",
                      description: "Determine if a binary tree is a valid binary search tree",
                      topics: ["BST", "Tree Traversal", "Validation"],
                      time: "25 min",
                    },
                    {
                      title: "Number of Islands",
                      difficulty: "Medium",
                      description: "Count the number of islands in a 2D grid using DFS/BFS",
                      topics: ["Graph", "DFS", "BFS", "Matrix"],
                      time: "30 min",
                    },
                    {
                      title: "Course Schedule",
                      difficulty: "Medium",
                      description: "Determine if you can finish all courses (topological sort)",
                      topics: ["Graph", "Topological Sort", "Cycle Detection"],
                      time: "35 min",
                    },
                    {
                      title: "Lowest Common Ancestor",
                      difficulty: "Hard",
                      description: "Find the lowest common ancestor of two nodes in a binary tree",
                      topics: ["Tree", "LCA", "Recursion"],
                      time: "40 min",
                    },
                  ].map((problem, index) => (
                    <motion.div
                      key={index}
                      className="p-6 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-green-400/30 transition-all duration-300 hover:scale-[1.02]"
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

                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
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
          <Link href="/concepts/linked-lists">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent group px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous: Linked Lists
            </Button>
          </Link>

          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 group px-8 py-3">
              Test Your Knowledge
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Globe, BarChart3, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { GlassmorphismCard } from "./glassmorphism-card"

interface KnowledgeMatrixProps {
  confusionLevel: number
  memeMode: boolean
}

export function KnowledgeMatrix({ memeMode }: KnowledgeMatrixProps) {
  const [activeTab, setActiveTab] = useState("analogies")
  const [expandedAnalogy, setExpandedAnalogy] = useState<number | null>(null)

  const tabs = [
    { id: "analogies", label: "Analogies", icon: Lightbulb, color: "from-yellow-400 to-orange-500" },
    { id: "realworld", label: "Real World", icon: Globe, color: "from-green-400 to-blue-500" },
    { id: "complexity", label: "Big-O Analysis", icon: BarChart3, color: "from-purple-400 to-pink-500" },
  ]

  const analogies = [
    {
      title: memeMode ? "Treasure Hunt Chain 🗺️" : "Treasure Hunt Chain",
      description: memeMode
        ? "Each clue is like a node that's absolutely OBSESSED with telling you where the next clue is! Can't skip ahead - that's cheating! 🏴‍☠️"
        : "Each clue (node) points to the next location. You can't skip ahead - you must follow the chain!",
      icon: "🗺️",
      difficulty: "Beginner",
      expanded:
        "Think of it like a scavenger hunt where each location has a note saying 'Go to the park bench' or 'Check under the bridge'. You can't just jump to the end - you have to follow each clue in order. That's exactly how linked lists work!",
    },
    {
      title: memeMode ? "Train Cars 🚂" : "Train Cars",
      description: memeMode
        ? "Choo choo! Each car knows exactly which car is behind it. Adding a new car? Just hook it up to the caboose! 🚃"
        : "Each car is connected to the next. Adding a new car means connecting it to the chain.",
      icon: "🚂",
      difficulty: "Beginner",
      expanded:
        "A train is a perfect analogy! Each car (node) is physically connected to the next car. The engine (head) pulls the whole train, and each car only needs to know about the car directly behind it. When you add a new car, you just couple it to the last car in the line.",
    },
    {
      title: memeMode ? "Netflix Queue 📺" : "Playlist Queue",
      description: memeMode
        ? "Your binge-watch list! Each show knows what's up next. Finished watching? Move to the next! Can't skip unless you're a rebel! 😈"
        : "Each song points to the next in your playlist. Sequential playback follows the links.",
      icon: "📺",
      difficulty: "Intermediate",
      expanded:
        "Your music or video queue works just like a linked list! Each item knows what comes next. When one finishes, it automatically moves to the next item. You can add new items to the end or insert them anywhere in the middle by updating the connections.",
    },
  ]

  const realWorldExamples = [
    {
      title: memeMode ? "Undo/Redo Magic ✨" : "Undo/Redo Operations",
      description: memeMode
        ? "Every time you mess up in Photoshop, linked lists got your back! Each action remembers the previous one. Ctrl+Z for days! 🎨"
        : "Text editors use linked lists to track document changes for undo functionality.",
      icon: "↩️",
      useCase: "Text Editors, IDEs, Design Software",
    },
    {
      title: memeMode ? "Browser History 🌐" : "Browser History",
      description: memeMode
        ? "Your browsing history is basically a linked list of questionable life choices! Each page knows where you came from! 🤫"
        : "Web browsers maintain navigation history using linked list structures.",
      icon: "🌐",
      useCase: "Web Browsers, Navigation Systems",
    },
    {
      title: memeMode ? "Music Streaming 🎵" : "Music Playlists",
      description: memeMode
        ? "Spotify's shuffle is just a linked list having an identity crisis! Each song vibing with the next! 🎧"
        : "Streaming services use linked lists for playlist management and playback queues.",
      icon: "🎵",
      useCase: "Spotify, Apple Music, YouTube",
    },
  ]

  const complexityData = [
    {
      operation: "Access",
      complexity: "O(n)",
      color: "text-red-400",
      explanation: "Must traverse from head to reach element",
    },
    { operation: "Search", complexity: "O(n)", color: "text-red-400", explanation: "Linear search through all nodes" },
    {
      operation: "Insertion",
      complexity: "O(1)*",
      color: "text-green-400",
      explanation: "Constant time if you have the position",
    },
    {
      operation: "Deletion",
      complexity: "O(1)*",
      color: "text-green-400",
      explanation: "Constant time if you have the node reference",
    },
  ]

  return (
    <GlassmorphismCard className="p-6 h-fit">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            {memeMode ? "Knowledge Matrix 🧠" : "Knowledge Matrix"}
          </h2>
          <Badge variant="outline" className="border-lime-400/30 text-lime-400">
            Interactive
          </Badge>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "analogies" && (
            <motion.div
              key="analogies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {analogies.map((analogy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/30 rounded-lg border border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedAnalogy(expandedAnalogy === index ? null : index)}
                    className="w-full p-4 text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{analogy.icon}</div>
                        <div>
                          <h3 className="font-semibold text-white">{analogy.title}</h3>
                          <p className="text-sm text-slate-400 mt-1">{analogy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${
                            analogy.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-400 border-green-400/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                          }`}
                        >
                          {analogy.difficulty}
                        </Badge>
                        {expandedAnalogy === index ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedAnalogy === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700"
                      >
                        <div className="p-4 bg-slate-900/30">
                          <p className="text-slate-300 leading-relaxed">{analogy.expanded}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "realworld" && (
            <motion.div
              key="realworld"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {realWorldExamples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-cyan-400/30 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {example.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-slate-400 mt-1 leading-relaxed">{example.description}</p>
                      <Badge className="mt-2 bg-cyan-400/10 text-cyan-400 border-cyan-400/30">{example.useCase}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "complexity" && (
            <motion.div
              key="complexity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid gap-4">
                {complexityData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-purple-400/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-white font-semibold">{item.operation}</div>
                      <div className={`font-mono text-lg ${item.color}`}>{item.complexity}</div>
                    </div>
                    <div className="text-sm text-slate-400 max-w-xs text-right">{item.explanation}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">Pro Tip</span>
                </div>
                <p className="text-slate-300 text-sm">
                  {memeMode
                    ? "The * means 'if you already know where you're going!' It's like having GPS vs wandering around lost! 🗺️"
                    : "The asterisk (*) indicates complexity when you have direct access to the node position."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassmorphismCard>
  )
}

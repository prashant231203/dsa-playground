"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, HelpCircle, MapPin } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"
import { ParticleBackground } from "@/components/particle-background"

export default function CommunityPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [showStruggleBus, setShowStruggleBus] = useState(false)

  const communityTips = [
    {
      author: "CodeNinja42",
      tip: "Use the two-pointer technique for array problems - it often reduces O(n²) to O(n)!",
      likes: 127,
      topic: "Arrays",
    },
    {
      author: "AlgoQueen",
      tip: "When working with linked lists, always draw it out first. Visual representation prevents pointer confusion!",
      likes: 89,
      topic: "Linked Lists",
    },
    {
      author: "TreeMaster",
      tip: "Remember: In-order traversal of BST gives sorted sequence. This property is super useful!",
      likes: 156,
      topic: "Trees",
    },
  ]

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Community Hub
              </h1>
              <p className="text-xl text-slate-400 mt-2">Connect, learn, and grow together</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-green-400/20 text-green-400 border-green-400/30 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              1,247 Online
            </Badge>
            <Button
              onClick={() => setShowStruggleBus(!showStruggleBus)}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              I&apos;m Stuck!
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Map */}
          <div className="lg:col-span-2">
            <GlassmorphismCard className="p-6 h-[600px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-cyan-400" />
                  Learning Journey Map
                </h2>
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-400">
                  Interactive
                </Badge>
              </div>

              {/* Learning Path Visualization */}
              <div className="relative w-full h-full">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Learning Path Lines */}
                  <path
                    d="M50 100 Q200 50 350 100 T650 100"
                    stroke="url(#gradient1)"
                    strokeWidth="4"
                    fill="none"
                    className="drop-shadow-lg"
                  />
                  <path
                    d="M50 200 Q200 150 350 200 T650 200"
                    stroke="url(#gradient2)"
                    strokeWidth="4"
                    fill="none"
                    className="drop-shadow-lg"
                  />
                  
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Learning Stations */}
                {[
                  { name: "Arrays", x: 100, y: 100, completed: true },
                  { name: "Linked Lists", x: 250, y: 100, completed: true },
                  { name: "Stacks", x: 400, y: 100, completed: false },
                  { name: "Trees", x: 100, y: 200, completed: false },
                  { name: "Graphs", x: 250, y: 200, completed: false },
                ].map((station, index) => (
                  <motion.div
                    key={station.name}
                    className={`absolute cursor-pointer group ${station.completed ? 'bg-green-500' : 'bg-gray-700'} rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-4 ${station.completed ? 'border-green-300' : 'border-gray-500'}`}
                    style={{
                      left: station.x,
                      top: station.y,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <span className="text-lg font-semibold text-white">{station.name}</span>
                    <span className={`text-xs mt-1 ${station.completed ? 'text-green-200' : 'text-gray-300'}`}>{station.completed ? 'Completed' : 'Locked'}</span>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>

          {/* Community Tips */}
          <div>
            <GlassmorphismCard className="p-6 h-[600px] flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-pink-400" />
                Community Tips
              </h2>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {communityTips.map((tip) => (
                  <div key={tip.author} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-orange-400">{tip.author}</span>
                      <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 px-2 py-1 ml-2">{tip.topic}</Badge>
                    </div>
                    <span className="text-slate-200">{tip.tip}</span>
                    <span className="text-xs text-slate-400">{tip.likes} likes</span>
                  </div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>
        </div>

        {/* Chat Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <GlassmorphismCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Community Chat</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your message..."
              />
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Send
              </Button>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}

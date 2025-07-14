"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Code,
  Zap,
  Calendar,
  Award,
  ChevronRight,
  Play,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  const skillProgress = [
    { name: "Arrays & Strings", progress: 85, total: 12, completed: 10, color: "from-blue-500 to-cyan-500" },
    { name: "Linked Lists", progress: 70, total: 8, completed: 6, color: "from-purple-500 to-pink-500" },
    { name: "Stacks & Queues", progress: 60, total: 10, completed: 6, color: "from-green-500 to-emerald-500" },
    { name: "Trees & Graphs", progress: 40, total: 15, completed: 6, color: "from-orange-500 to-red-500" },
    { name: "Dynamic Programming", progress: 25, total: 20, completed: 5, color: "from-indigo-500 to-purple-500" },
  ]

  const recentActivity = [
    {
      action: "Completed Linked Lists Visualization",
      time: "2 hours ago",
      xp: 50,
      type: "lesson",
      icon: BookOpen,
    },
    {
      action: "Scored 95% on Arrays Quiz",
      time: "1 day ago",
      xp: 75,
      type: "quiz",
      icon: Target,
    },
    {
      action: "Solved 'Two Sum' Problem",
      time: "2 days ago",
      xp: 100,
      type: "problem",
      icon: Code,
    },
    {
      action: "Started Binary Trees Module",
      time: "3 days ago",
      xp: 25,
      type: "lesson",
      icon: BookOpen,
    },
  ]

  const weeklyStats = [
    { day: "Mon", problems: 3, time: 45 },
    { day: "Tue", problems: 5, time: 60 },
    { day: "Wed", problems: 2, time: 30 },
    { day: "Thu", problems: 4, time: 55 },
    { day: "Fri", problems: 6, time: 75 },
    { day: "Sat", problems: 3, time: 40 },
    { day: "Sun", problems: 1, time: 15 },
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
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Analytics
                  </span>
                </h1>
                <p className="text-2xl text-slate-400">Track your learning progress and performance</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 px-4 py-2 text-lg">
                <Award className="w-4 h-4 mr-2" />
                Level 12
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30 px-4 py-2 text-lg">
                🔥 7-day Streak
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Total XP", value: "2,450", change: "+125", color: "text-yellow-400", icon: Zap },
              { label: "Problems Solved", value: "47", change: "+8", color: "text-green-400", icon: Code },
              { label: "Study Time", value: "23h", change: "+4h", color: "text-blue-400", icon: Clock },
              { label: "Concepts Mastered", value: "12", change: "+2", color: "text-purple-400", icon: BookOpen },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GlassmorphismCard className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </GlassmorphismCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Progress */}
            <GlassmorphismCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Learning Progress</h2>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
                  View All Topics
                </Button>
              </div>

              <div className="space-y-6">
                {skillProgress.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </h3>
                        <Badge className="bg-slate-700/50 text-slate-300 text-xs">
                          {skill.completed}/{skill.total} completed
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">{skill.progress}%</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-3 bg-gradient-to-r ${skill.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>

            {/* Weekly Activity */}
            <GlassmorphismCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Weekly Activity</h2>
                <div className="flex space-x-2">
                  {["week", "month"].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {weeklyStats.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-sm text-slate-400 mb-2">{day.day}</div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-blue-400/30 transition-colors">
                      <div className="text-lg font-bold text-white mb-1">{day.problems}</div>
                      <div className="text-xs text-slate-400">problems</div>
                      <div className="text-xs text-blue-400 mt-1">{day.time}min</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <GlassmorphismCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/quiz">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 justify-start">
                    <Target className="w-4 h-4 mr-3" />
                    Take Practice Quiz
                  </Button>
                </Link>
                <Link href="/concepts/linked-lists">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent justify-start"
                  >
                    <Play className="w-4 h-4 mr-3" />
                    Continue Learning
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent justify-start"
                  >
                    <Code className="w-4 h-4 mr-3" />
                    Solve Problems
                  </Button>
                </Link>
              </div>
            </GlassmorphismCard>

            {/* Recent Activity */}
            <GlassmorphismCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-blue-400/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "lesson"
                          ? "bg-blue-500/20"
                          : activity.type === "quiz"
                            ? "bg-purple-500/20"
                            : "bg-green-500/20"
                      }`}
                    >
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium">{activity.action}</div>
                      <div className="text-xs text-slate-400">{activity.time}</div>
                    </div>
                    <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/30 text-xs">+{activity.xp} XP</Badge>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>

            {/* Achievements */}
            <GlassmorphismCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {[
                  { name: "First Steps", icon: "🎯", description: "Completed first lesson" },
                  { name: "Streak Master", icon: "🔥", description: "7-day learning streak" },
                  { name: "Quiz Champion", icon: "🏆", description: "Perfect quiz score" },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-yellow-400">{achievement.name}</div>
                      <div className="text-xs text-slate-400">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </div>
  )
}

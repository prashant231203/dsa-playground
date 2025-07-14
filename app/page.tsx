"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Target, BarChart3, Users, Zap, CheckCircle, TrendingUp, Award } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { GlassmorphismCard } from "@/components/glassmorphism-card"
import { BinaryTreeAnimation } from "@/components/binary-tree-animation"
import { AlgorithmVisualizer } from "@/components/algorithm-visualizer"
import { ParticleBackground } from "@/components/particle-background"
import Link from "next/link"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Master data structures and algorithms through visual explanations and hands-on examples",
      href: "/concepts/linked-lists",
      color: "from-blue-500 to-cyan-500",
      stats: "50+ Concepts",
    },
    {
      icon: Target,
      title: "Practice Arena",
      description: "Test your knowledge with adaptive quizzes and coding challenges",
      href: "/quiz",
      color: "from-purple-500 to-pink-500",
      stats: "200+ Problems",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Track your learning journey with detailed insights and performance metrics",
      href: "/dashboard",
      color: "from-green-500 to-emerald-500",
      stats: "Real-time Tracking",
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with peers, share knowledge, and learn from experienced developers",
      href: "/community",
      color: "from-orange-500 to-red-500",
      stats: "1000+ Members",
    },
  ]

  const benefits = [
    "Industry-standard curriculum",
    "Visual learning approach",
    "Progress tracking",
    "Community support",
    "Interview preparation",
    "Hands-on practice",
  ]

  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length, isClient])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading DSA Academy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Professional DSA Training
                </Badge>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Master Data Structures &{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Algorithms
                  </span>
                </h1>

                <p className="text-xl text-slate-400 leading-relaxed">
                  Build a solid foundation in computer science fundamentals with our comprehensive, interactive learning
                  platform designed for serious developers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/concepts/linked-lists">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/quiz">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 rounded-lg bg-transparent"
                  >
                    Take Assessment
                  </Button>
                </Link>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 text-slate-300"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <BinaryTreeAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Comprehensive Learning Platform</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to master data structures and algorithms, from beginner concepts to advanced
              techniques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <Link href={feature.href}>
                  <GlassmorphismCard
                    className={`p-6 h-full transition-all duration-300 hover:scale-105 cursor-pointer ${
                      activeFeature === index ? "ring-2 ring-blue-500/50" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{feature.description}</p>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {feature.stats}
                        </Badge>
                      </div>

                      <div className="flex items-center text-blue-400 text-sm font-medium">
                        Explore <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </GlassmorphismCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">See Algorithms in Action</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Interactive visualizations help you understand complex algorithms step by step
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AlgorithmVisualizer />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Learners", value: "10,000+", icon: Users },
              { label: "Concepts Covered", value: "50+", icon: BookOpen },
              { label: "Practice Problems", value: "500+", icon: Target },
              { label: "Success Rate", value: "94%", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Level Up Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}
                Programming Skills?
              </span>
            </h2>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join thousands of developers who have mastered DSA fundamentals and landed their dream jobs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/concepts/linked-lists">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-12 py-4 rounded-lg bg-transparent"
                >
                  View Progress Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-500">Free to start • No credit card required • Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

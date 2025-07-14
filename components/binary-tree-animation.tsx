"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function BinaryTreeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 500
    canvas.height = 400

    const nodes = [
      { x: 250, y: 50, value: "50", level: 0 },
      { x: 150, y: 120, value: "30", level: 1 },
      { x: 350, y: 120, value: "70", level: 1 },
      { x: 100, y: 190, value: "20", level: 2 },
      { x: 200, y: 190, value: "40", level: 2 },
      { x: 300, y: 190, value: "60", level: 2 },
      { x: 400, y: 190, value: "80", level: 2 },
    ]

    const connections = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
    ]

    let animationFrame: number
    let time = 0

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      connections.forEach(([from, to]) => {
        const fromNode = nodes[from]
        const toNode = nodes[to]
        if (fromNode && toNode) {
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.stroke()
        }
      })

      // Draw nodes
      nodes.forEach((node, index) => {
        if (!node) return

        const pulse = Math.sin(time * 0.01 + index * 0.5) * 0.1 + 1
        const radius = 25 * pulse

        // Glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2)
        gradient.addColorStop(0, "#8B5CF6")
        gradient.addColorStop(0.5, "#3B82F6")
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Node circle
        ctx.fillStyle = "#1e293b"
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "#3B82F6"
        ctx.lineWidth = 2
        ctx.stroke()

        // Node text
        ctx.fillStyle = "#ffffff"
        ctx.font = "16px Inter"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.value, node.x, node.y)
      })

      time++
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="w-[500px] h-[400px] bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-center">
        <div className="text-slate-400">Loading visualization...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -20 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl blur-xl"></div>
      <canvas
        ref={canvasRef}
        className="relative z-10 rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm"
      />
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, User, Users, Menu, X } from "lucide-react"
import Link from "next/link"

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/concepts/linked-lists", icon: BookOpen, label: "Learn", color: "from-cyan-400 to-blue-500" },
    { href: "/quiz", icon: Target, label: "Quiz", color: "from-pink-500 to-red-500" },
    { href: "/dashboard", icon: User, label: "Dashboard", color: "from-lime-400 to-green-500" },
    { href: "/community", icon: Users, label: "Community", color: "from-purple-400 to-pink-500" },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Button
                    className={`w-14 h-14 rounded-full bg-gradient-to-r ${item.color} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-lime-400 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <Menu className="w-8 h-8 text-white" />}
      </Button>
    </div>
  )
}

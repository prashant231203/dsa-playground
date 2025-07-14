"use client"

import { Navigation } from "@/components/navigation"
import { ProblemList } from "@/components/problems/problem-list"
import { ParticleBackground } from "@/components/particle-background"

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ProblemList />
        </div>
      </div>
    </div>
  )
}

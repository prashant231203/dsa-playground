"use client"

import { Navigation } from "@/components/navigation"
import { ProblemSolver } from "@/components/problems/problem-solver"
import { ParticleBackground } from "@/components/particle-background"

interface ProblemPageProps {
  params: {
    id: string
  }
}

export default function ProblemPage({ params }: ProblemPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      <div className="pt-16 h-screen">
        <div className="h-full p-6">
          <ProblemSolver problemId={params.id} />
        </div>
      </div>
    </div>
  )
}

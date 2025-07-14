"use client"

import { Navigation } from "@/components/navigation"
import { UserProfile } from "@/components/profile/user-profile"
import { ParticleBackground } from "@/components/particle-background"
import { useAuthStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <ParticleBackground />
        <Navigation />

        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-6 py-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <LogIn className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
                <p className="text-slate-400 mb-6">Please sign in to view your profile and track your progress.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <ParticleBackground />
      <Navigation />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <UserProfile />
        </div>
      </div>
    </div>
  )
}

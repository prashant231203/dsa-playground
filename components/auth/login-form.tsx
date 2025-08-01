"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store"
import { useUIStore } from "@/lib/store"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onToggleMode?: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const { addNotification } = useUIStore()
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email || !password) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all fields",
      })
      return
    }

    try {
      await login(email, password)
      addNotification({
        type: "success",
        title: "Welcome back!",
        message: "You've successfully logged in",
      })
      router.push("/dashboard");
    } catch {
      // Error is handled by the store
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-800/90 backdrop-blur-sm border-slate-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Welcome Back</CardTitle>
        <CardDescription className="text-center text-slate-300">
          Sign in to continue your learning journey
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-700/30 p-2 rounded">
            Demo credentials: test@test.com / password
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            {onToggleMode && (
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-400 hover:text-blue-300 font-medium"
                disabled={isLoading}
              >
                Sign up
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

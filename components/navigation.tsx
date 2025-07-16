"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore, useUIStore } from "@/lib/store"
import { AuthModal } from "@/components/auth/auth-modal"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Home, BookOpen, Code, Trophy, User, Settings, LogOut, Menu, X, Zap, Target } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Concepts", href: "/concepts", icon: BookOpen },
  { name: "Problems", href: "/problems", icon: Code },
  { name: "Quiz", href: "/quiz", icon: Trophy },
  { name: "Dashboard", href: "/dashboard", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { activeModal, setActiveModal } = useUIStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAuthModal = (mode: "login" | "register") => {
    setActiveModal(mode)
  }

  const closeAuthModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DSA Playground</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-400 bg-blue-400/10"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Notifications */}
              {isAuthenticated && <NotificationCenter />}

              {/* User Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <span>Level {user.level}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            <span>{user.xp}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3 text-orange-400" />
                            <span>{user.streak}</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-xs">
                          Level {user.level}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-yellow-400">
                          <Zap className="h-3 w-3" />
                          <span>{user.xp} XP</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
                        <Trophy className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center space-x-2 cursor-pointer text-red-400 focus:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthModal("login")}
                    className="text-slate-300 hover:text-white"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthModal("register")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? "text-blue-400 bg-blue-400/10"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={activeModal === "login" || activeModal === "register"}
        onClose={closeAuthModal}
        defaultMode={(activeModal as "login" | "register") || "login"}
      />
    </>
  )
}

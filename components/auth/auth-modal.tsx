"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultMode }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
        {mode === "login" ? <LoginForm onToggleMode={toggleMode} /> : <RegisterForm onToggleMode={toggleMode} />}
      </DialogContent>
    </Dialog>
  )
}

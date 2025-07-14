import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/lib/store";
import { Home, BookOpen, Code, Trophy, User } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Sidebar is only rendered on the client, so we use a dynamic import or a client wrapper if needed.
  // For now, we assume this is a client component.
  // User info is fetched from zustand store.
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar>
              <SidebarHeader>
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">DSA Playground</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/">
                      <SidebarMenuButton isActive={false}>
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/concepts">
                      <SidebarMenuButton isActive={false}>
                        <BookOpen className="h-4 w-4" />
                        <span>Concepts</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/problems">
                      <SidebarMenuButton isActive={false}>
                        <Code className="h-4 w-4" />
                        <span>Problems</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/quiz">
                      <SidebarMenuButton isActive={false}>
                        <Trophy className="h-4 w-4" />
                        <span>Quiz</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard">
                      <SidebarMenuButton isActive={false}>
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator />
                <div className="flex flex-col items-center mt-4">
                  <ThemeToggle />
                </div>
              </SidebarContent>
              <SidebarFooter>
                {/* User profile section can be added here if user is logged in */}
              </SidebarFooter>
            </Sidebar>
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

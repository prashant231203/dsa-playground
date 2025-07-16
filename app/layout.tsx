import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'DSA Playground - Learn Data Structures & Algorithms',
  description: 'Interactive platform for learning and practicing Data Structures and Algorithms with real-time code execution',
  generator: 'DSA Playground',
  keywords: ['DSA', 'Algorithms', 'Data Structures', 'Coding', 'Practice', 'Learning'],
  authors: [{ name: 'DSA Playground Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </AuthProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import StoreProvider from "@/components/StoreProvider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Training Portal",
  description: "A platform for employee training and development",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              {children}
              <footer className="bg-white border-t mt-12 py-6">
                <div className="container mx-auto px-4 text-center text-gray-500">
                  &copy; {new Date().getFullYear()} Employee Training Portal. All rights reserved.
                </div>
              </footer>
              <Toaster />
            </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
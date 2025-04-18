"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { fetchEnrolledCourses } from "@/lib/features/courses/coursesSlice"
import type { AppDispatch } from "@/lib/store"
import { useRedirectAfterLogin } from "@/hooks/useRedirectAfterLogin"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { redirectToSavedLocation } = useRedirectAfterLogin()

  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  // ✅ Only redirect if the user is really authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const user = await response.json();

        if (response.ok && user?.id) {
          const didRedirect = redirectToSavedLocation()
          if (!didRedirect) {
            router.replace(redirectUrl)
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      }
    }

    checkAuth()
  }, [router, redirectUrl, redirectToSavedLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user))

        await dispatch(fetchEnrolledCourses()).unwrap()

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // ✅ Only do one redirect
        const didRedirect = redirectToSavedLocation()
        if (!didRedirect) {
          router.replace(redirectUrl)
        }
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
          {redirectUrl !== "/dashboard" && (
            <div className="text-sm text-blue-500">
              You'll be redirected back after login
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
                className="text-blue-500 hover:text-blue-700"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

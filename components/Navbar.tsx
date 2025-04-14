"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'
import { useDispatch } from "react-redux"
import { fetchEnrolledCourses, setEnrolledCourses } from "@/lib/features/courses/coursesSlice"
import type { AppDispatch } from "@/lib/store"

// Create a client-side auth service that doesn't import MongoDB
const authService = {
  async getCurrentUser() {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem("currentUser");
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
};

export default function Navbar() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser)

      if (currentUser) {
        // Fetch enrolled courses when user is logged in
        dispatch(fetchEnrolledCourses())
      } else {
        // Clear enrolled courses when user is logged out
        dispatch(setEnrolledCourses([]))
      }
    }

    checkAuth()
  }, [pathname, dispatch])

  const handleLogout = async () => {
    await authService.logout();
    setUser(null)
    dispatch(setEnrolledCourses([]))
    router.push("/login")
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Employee Training Portal
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Courses
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
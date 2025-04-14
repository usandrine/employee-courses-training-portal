// app/courses/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { updateEnrollment } from "@/lib/features/courses/coursesSlice"
import type { RootState, AppDispatch } from "@/lib/store"
import type { Course } from "@/types/course"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User } from 'lucide-react'
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRedirectAfterLogin } from "@/hooks/useRedirectAfterLogin"

// Create a client-side auth service
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
  }
};

export default function CourseDetails() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const { toast } = useToast()
  const { redirectToSavedLocation } = useRedirectAfterLogin()

  // Get the redirect URL from query parameters
  const redirectUrl = searchParams.get("redirect")

  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses)
  const isEnrolled = enrolledCourses.includes(id as string)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated using the client-side service
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser)

        // Fetch course details
        const res = await fetch(`/api/courses/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch course")
        }
        const data = await res.json()
        setCourse(data)
      } catch (err) {
        setError("Failed to load course details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEnrollment = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this course",
        variant: "destructive",
      })
      
      // The hook will automatically save the redirect URL from the query parameter
      router.push(`/login?redirect=/courses/${id}`)
      return
    }

    try {
      if (isEnrolled) {
        await dispatch(updateEnrollment({ courseId: id as string, action: "unenroll" })).unwrap()
        toast({
          title: "Unenrolled",
          description: `You have successfully unenrolled from ${course?.title}`,
        })
      } else {
        await dispatch(updateEnrollment({ courseId: id as string, action: "enroll" })).unwrap()
        toast({
          title: "Enrolled",
          description: `You have successfully enrolled in ${course?.title}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || "Course not found"}</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-blue-500 hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

        <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            <span>Instructor: {course.instructor}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{course.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Prerequisites</h2>
          <p className="text-gray-700">{course.prerequisites || "No prerequisites required"}</p>
        </div>

        {user ? (
          <>
            <Button
              onClick={handleEnrollment}
              className={isEnrolled ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              {isEnrolled ? "Unenroll" : "Enroll Now"}
            </Button>

            {isEnrolled && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">You are enrolled in this course!</div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md">
              You need to be logged in to enroll in this course.
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href={`/login?redirect=/courses/${id}`}>Login to Enroll</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/register?redirect=${encodeURIComponent(`/courses/${id}`)}`}>Register</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
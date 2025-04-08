"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import type { RootState } from "@/lib/store"
import type { Course } from "@/types/course"

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [enrolledCourseData, setEnrolledCourseData] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const enrolledCourseIds = useSelector((state: RootState) => state.courses.enrolledCourses)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)

      // Fetch enrolled course data
      if (enrolledCourseIds.length > 0) {
        try {
          const promises = enrolledCourseIds.map((id) => fetch(`/api/courses/${id}`).then((res) => res.json()))
          const courses = await Promise.all(promises)
          setEnrolledCourseData(courses)
        } catch (error) {
          console.error("Failed to fetch enrolled courses:", error)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [enrolledCourseIds, router])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track your enrolled courses and learning progress from your personal dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Course completion statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Courses Enrolled</span>
                  <span className="text-sm font-medium">{enrolledCourseIds.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Courses Completed</span>
                  <span className="text-sm font-medium">0/{enrolledCourseIds.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          <TabsContent value="enrolled" className="mt-6">
            {enrolledCourseData.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600 mb-4">You haven't enrolled in any courses yet</h3>
                <Button asChild>
                  <Link href="/">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourseData.map((course) => (
                  <Card key={course.id} className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">{course.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">{course.shortDescription}</p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-blue-500 hover:text-blue-700 hover:underline"
                      >
                        Continue Learning
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recommended" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-4">Personalized recommendations coming soon</h3>
              <Button asChild>
                <Link href="/">Browse All Courses</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Course } from "@/types/course"
import CourseCard from "./CourseCard"

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const searchQuery = useSelector((state: RootState) => state.courses.searchQuery)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = searchQuery ? `/api/courses?search=${encodeURIComponent(searchQuery)}` : "/api/courses"

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await res.json()
        setCourses(data)
      } catch (err) {
        setError("Failed to load courses. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [searchQuery])

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery ? "No courses match your search criteria." : "No courses available."}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

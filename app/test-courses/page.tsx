// app/test-courses/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function TestCoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        // First try the test endpoint with hardcoded courses
        const response = await fetch('/api/test-courses')
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching courses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading courses...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Courses Page</h1>
      
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.shortDescription}</p>
            <div className="text-sm text-gray-500">Duration: {course.duration}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
        <p>Courses loaded: {courses.length}</p>
        <details>
          <summary className="cursor-pointer text-blue-500">View raw data</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-60">
            {JSON.stringify(courses, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
// app/api/courses/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { courses as sampleCourses } from "@/data/courses"

// Set a timeout for database operations
const DB_TIMEOUT = 2000; // 2 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchQuery = searchParams.get("search")?.toLowerCase() || ""

    // Use sample data directly for faster loading
    if (searchQuery) {
      const filteredCourses = sampleCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery) ||
          course.shortDescription.toLowerCase().includes(searchQuery) ||
          course.description.toLowerCase().includes(searchQuery)
      )
      return NextResponse.json(filteredCourses)
    }
    
    return NextResponse.json(sampleCourses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    // Return sample data as a fallback
    return NextResponse.json(sampleCourses)
  }
}
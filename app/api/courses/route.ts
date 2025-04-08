import { type NextRequest, NextResponse } from "next/server"
import { courses } from "@/data/courses"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  if (searchQuery) {
    const filteredCourses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery) ||
        course.shortDescription.toLowerCase().includes(searchQuery) ||
        course.description.toLowerCase().includes(searchQuery),
    )
    return NextResponse.json(filteredCourses)
  }

  return NextResponse.json(courses)
}

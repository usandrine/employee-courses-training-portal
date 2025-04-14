// app/api/courses/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { courses as sampleCourses } from "@/data/courses"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const sampleCourse = sampleCourses.find(course => course.id === id)

    if (sampleCourse) {
      return NextResponse.json(sampleCourse)
    }

    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

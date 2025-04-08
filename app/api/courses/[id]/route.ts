import { type NextRequest, NextResponse } from "next/server"
import { courses } from "@/data/courses"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const id = params.id

  const course = courses.find((c) => c.id === id)

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}

// app/api/test-courses/route.ts
import { NextResponse } from "next/server"
import { courses } from "@/data/courses"

export async function GET() {
  // Return the hardcoded courses from data/courses.ts
  return NextResponse.json(courses)
}
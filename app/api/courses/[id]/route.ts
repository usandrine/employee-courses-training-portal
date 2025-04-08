import { type NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Await params to handle the promise
  const { id } = await params; // Destructure and await params

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

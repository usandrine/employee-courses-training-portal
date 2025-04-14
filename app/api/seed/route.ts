// app/api/seed/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { courses } from "@/data/courses"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    
    // Check if courses collection already has data
    const coursesCollection = db.collection("courses")
    const courseCount = await coursesCollection.countDocuments()
    
    if (courseCount === 0) {
      // Insert sample courses
      await coursesCollection.insertMany(courses)
      return NextResponse.json({ 
        success: true, 
        message: `Seeded database with ${courses.length} courses` 
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: `Database already has ${courseCount} courses` 
      })
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ 
      success: false, 
      error: `Failed to seed database: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 })
  }
}
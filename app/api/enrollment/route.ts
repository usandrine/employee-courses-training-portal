// app/api/enrollment/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const cookieStore = await cookies()
const userIdCookie = cookieStore.get("userId")

    
    if (!userIdCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const userId = userIdCookie.value
    
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({ enrolledCourses: user.enrolledCourses || [] })
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
const userIdCookie = cookieStore.get("userId")

    
    if (!userIdCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const userId = userIdCookie.value
    const { courseId, action } = await request.json()
    
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db("emplyee_db")
    
    let result;
    
    if (action === "enroll") {
      result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { enrolledCourses: courseId } }
      )
    } else if (action === "unenroll") {
      result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { enrolledCourses: courseId } }
      )
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
    
    if (result.modifiedCount > 0) {
      const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) })
      return NextResponse.json({ 
        success: true, 
        enrolledCourses: updatedUser?.enrolledCourses || [] 
      })
    } else {
      return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating enrollment:", error)
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
  }
}
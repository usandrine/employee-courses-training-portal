// app/api/auth/me/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    // Get user ID from cookie - add await here
    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get("userId")
    
    if (!userIdCookie?.value) {
      return NextResponse.json(null)
    }
    
    const userId = userIdCookie.value
    
    // Get user from database
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    
    if (!user) {
      return NextResponse.json(null)
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(null)
  }
}
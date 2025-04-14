// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    const client = await clientPromise
    const db = client.db("emplyee_db")
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10)
    
    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      enrolledCourses: [],
      createdAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      userId: result.insertedId.toString()
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { compare } from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const user = await db.collection("users").findOne({ email })
    
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
    
    const isPasswordValid = await compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }
    
    // Set cookie with user ID - add await here
    const cookieStore = await cookies()
    cookieStore.set({
      name: "userId",
      value: user._id.toString(),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
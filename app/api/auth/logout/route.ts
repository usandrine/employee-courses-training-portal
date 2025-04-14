// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the user ID cookie - add await here
    const cookieStore = await cookies()
    cookieStore.delete("userId")
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  const cookieStore = await cookies()
  const userIdCookie = cookieStore.get("userId")

  if (!userIdCookie?.value) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("emplyee_db") // ✅ be explicit here

  const user = await db.collection("users").findOne({
    _id: new ObjectId(userIdCookie.value),
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Only send the data needed by the frontend
  const safeUser = {
    name: user.name,
    email: user.email, // Optional: only include if you need it
  }

  return NextResponse.json({ success: true, user: safeUser })
}

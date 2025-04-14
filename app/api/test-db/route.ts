// app/api/test-db/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    
    // List all collections
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      collections: collections.map(c => c.name)
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ 
      success: false, 
      error: `Database connection failed: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 })
  }
}
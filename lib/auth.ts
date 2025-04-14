// --- lib/auth.ts ---
import { compare, hash } from "bcryptjs"
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

let currentUser: { id: string; name: string; email: string } | null = null
const isBrowser = typeof window !== "undefined"

if (isBrowser) {
  try {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      currentUser = JSON.parse(storedUser)
    }
  } catch (error) {
    console.error("Failed to parse stored user:", error)
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email })
    if (!user || !user.password) return false

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return false

    const { password: _, ...userInfo } = user
    currentUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    if (isBrowser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    return true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

export async function register(name: string, email: string, password: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) return false

    const hashedPassword = await hash(password, 10)
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      enrolledCourses: [],
      createdAt: new Date(),
    })

    return !!result.insertedId
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  currentUser = null
  if (isBrowser) localStorage.removeItem("currentUser")
}

export async function getCurrentUser(): Promise<{ id: string; name: string; email: string } | null> {
  if (isBrowser) {
    try {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) return JSON.parse(storedUser)
    } catch (error) {
      console.error("Failed to parse stored user:", error)
    }
  }
  return currentUser
}

export async function isAuthenticated(): Promise<boolean> {
  return !!(await getCurrentUser())
}

export async function getUserEnrolledCourses(userId: string): Promise<string[]> {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    return user?.enrolledCourses || []
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    return []
  }
}

export async function enrollUserInCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const usersCollection = db.collection("users")

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { enrolledCourses: courseId } },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return false
  }
}

export async function unenrollUserFromCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db("emplyee_db")
    const usersCollection = db.collection("users")

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { enrolledCourses: courseId } },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error unenrolling from course:", error)
    return false
  }
}

// This is a simplified auth implementation for demo purposes
// In a real application, you would use a proper authentication system

// Mock user database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
  },
]

// Store the current user in localStorage (in a real app, use cookies or JWT)
let currentUser: { id: string; name: string; email: string } | null = null

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Initialize from localStorage if available
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
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Store user info (excluding password)
    const { password: _, ...userInfo } = user
    currentUser = userInfo

    if (isBrowser) {
      localStorage.setItem("currentUser", JSON.stringify(userInfo))
    }

    return true
  }

  return false
}

export async function register(name: string, email: string, password: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return false
  }

  // Create new user
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password,
  }

  users.push(newUser)
  return true
}

export async function logout(): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  currentUser = null

  if (isBrowser) {
    localStorage.removeItem("currentUser")
  }
}

export async function getCurrentUser(): Promise<{ name: string; email: string } | null> {
  // In a real app, you would validate the token/session here
  if (isBrowser) {
    try {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error)
    }
  }

  return currentUser
}

export async function isAuthenticated(): Promise<boolean> {
  return !!(await getCurrentUser())
}

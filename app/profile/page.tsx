"use client"

import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Prevent hydration mismatch
    setIsClient(true)

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include", // ✅ include cookies for authentication
        })

        const data = await res.json()

        if (res.ok && data) {
          setUser(data)
        } else {
          console.error("Error fetching user:", data?.error || "Unknown error")
        }
      } catch (err) {
        console.error("Fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (!isClient) return null

  if (loading) return <p className="p-6">Loading profile...</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      {user ? (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>User not found or not logged in.</p>
      )}
    </div>
  )
}

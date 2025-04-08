"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { setSearchQuery } from "@/lib/features/courses/coursesSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSearchQuery(query))
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-l-md rounded-r-none border-r-0"
        />
      </div>
      <Button type="submit" className="rounded-l-none">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}

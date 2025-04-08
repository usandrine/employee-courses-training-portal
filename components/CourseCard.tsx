"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Course } from "@/types/course"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses)
  const isEnrolled = enrolledCourses.includes(course.id)

  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          {isEnrolled && <Badge className="bg-green-500">Enrolled</Badge>}
        </div>
        <CardDescription className="flex items-center mt-2">
          <Clock className="h-4 w-4 mr-1" />
          {course.duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 line-clamp-3">{course.shortDescription}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="text-blue-500 hover:text-blue-700 hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

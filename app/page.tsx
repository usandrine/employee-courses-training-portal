import CourseList from "@/components/CourseList"
import SearchBar from "@/components/SearchBar"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Employee Training Portal</h1>
      <div className="flex justify-center mb-8">
        <SearchBar />
      </div>
      <CourseList />
    </main>
  )
}

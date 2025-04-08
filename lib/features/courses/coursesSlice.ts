import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CoursesState {
  enrolledCourses: string[]
  searchQuery: string
}

const initialState: CoursesState = {
  enrolledCourses: [],
  searchQuery: "",
}

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    enrollCourse: (state, action: PayloadAction<string>) => {
      if (!state.enrolledCourses.includes(action.payload)) {
        state.enrolledCourses.push(action.payload)
      }
    },
    unenrollCourse: (state, action: PayloadAction<string>) => {
      state.enrolledCourses = state.enrolledCourses.filter((id) => id !== action.payload)
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { enrollCourse, unenrollCourse, setSearchQuery } = coursesSlice.actions

export default coursesSlice.reducer

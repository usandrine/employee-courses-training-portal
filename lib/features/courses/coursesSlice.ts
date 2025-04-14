import { MongoClient } from 'mongodb'
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface CoursesState {
  enrolledCourses: string[]
  searchQuery: string
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  enrolledCourses: [],
  searchQuery: "",
  loading: false,
  error: null,
}

// Async thunks
export const fetchEnrolledCourses = createAsyncThunk("courses/fetchEnrolledCourses", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/enrollment")
    if (!response.ok) {
      throw new Error("Failed to fetch enrolled courses")
    }
    const data = await response.json()
    return data.enrolledCourses
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const updateEnrollment = createAsyncThunk(
  "courses/updateEnrollment",
  async ({ courseId, action }: { courseId: string; action: "enroll" | "unenroll" }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, action }),
      })

      if (!response.ok) {
        throw new Error("Failed to update enrollment")
      }

      const data = await response.json()
      return data.enrolledCourses
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setEnrolledCourses: (state, action: PayloadAction<string[]>) => {
      state.enrolledCourses = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false
        state.enrolledCourses = action.payload
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateEnrollment.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload
      })
  },
})

export const { setSearchQuery, setEnrolledCourses } = coursesSlice.actions

export default coursesSlice.reducer

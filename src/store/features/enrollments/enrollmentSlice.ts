
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import api from '@/services/api';

type Course = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  status?: string;
};

export type Enrollment = {
  _id: string;

  course: Course | string;

  progress?: number;

  status?: string;

  completedLessons?: string[];
};

type EnrollmentState = {
  myCourses: Enrollment[];

  loading: boolean;

  error: string | null;

  enrollSuccess: boolean;

  completingLessonId: string | null;
};

const initialState: EnrollmentState = {
  myCourses: [],

  loading: false,

  error: null,

  enrollSuccess: false,

  completingLessonId: null,
};

const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error
  ) {
    return (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response?.data?.message;
  }

  return undefined;
};

// ========================================
// ENROLL COURSE
// POST /courses/:courseId/enroll
// ========================================

export const enrollCourse = createAsyncThunk(
  'enrollments/enrollCourse',

  async (
    courseId: string,
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/enroll`,
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Enrollment failed',
      );
    }
  },
);

// ========================================
// GET MY COURSES
// GET /courses/my/enrollments
// ========================================

export const fetchMyCourses = createAsyncThunk(
  'enrollments/fetchMyCourses',

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        '/courses/my/enrollments',
      );

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to fetch enrolled courses',
      );
    }
  },
);

// ========================================
// COMPLETE LESSON
// PATCH /courses/:courseId/lessons/:lessonId/complete
// ========================================

export const completeLesson = createAsyncThunk(
  'enrollments/completeLesson',

  async (
    {
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    },
    {
      dispatch,
      rejectWithValue,
    },
  ) => {
    try {
      const response = await api.patch(
        `/courses/${courseId}/lessons/${lessonId}/complete`,
      );

      // Lesson complete hone ke baad
      // latest enrollment/progress dobara fetch karo.
      await dispatch(fetchMyCourses());

      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to complete lesson',
      );
    }
  },
);

// ========================================
// SLICE
// ========================================

const enrollmentSlice = createSlice({
  name: 'enrollments',

  initialState,

  reducers: {
    resetEnrollment: (state) => {
      state.error = null;
      state.enrollSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ====================================
      // ENROLL COURSE
      // ====================================

      .addCase(
        enrollCourse.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.enrollSuccess = false;
        },
      )

      .addCase(
        enrollCourse.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
          state.enrollSuccess = true;
        },
      )

      .addCase(
        enrollCourse.rejected,
        (state, action) => {
          state.loading = false;
          state.enrollSuccess = false;

          state.error =
            (action.payload as string) ||
            'Enrollment failed';
        },
      )

      // ====================================
      // MY COURSES
      // ====================================

      .addCase(
        fetchMyCourses.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchMyCourses.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.myCourses = Array.isArray(
            action.payload,
          )
            ? action.payload
            : [];
        },
      )

      .addCase(
        fetchMyCourses.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            (action.payload as string) ||
            'Failed to fetch enrolled courses';
        },
      )

      // ====================================
      // COMPLETE LESSON
      // ====================================

      .addCase(
        completeLesson.pending,
        (state, action) => {
          state.error = null;

          state.completingLessonId =
            action.meta.arg.lessonId;
        },
      )

      .addCase(
        completeLesson.fulfilled,
        (state) => {
          state.completingLessonId = null;
        },
      )

      .addCase(
        completeLesson.rejected,
        (state, action) => {
          state.completingLessonId = null;

          state.error =
            (action.payload as string) ||
            'Failed to complete lesson';
        },
      );
  },
});

export const {
  resetEnrollment,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;

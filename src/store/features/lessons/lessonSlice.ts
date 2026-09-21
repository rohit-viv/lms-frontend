import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import api from '@/services/api';

export type Lesson = {
  _id: string;
  title: string;
  content: string;
  order: number;
  isPublished: boolean;
};

type LessonState = {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
};

type LessonPayload = {
  title: string;
  content: string;
  order?: number;
  isPublished?: boolean;
};

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
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

export const fetchLessons = createAsyncThunk(
  'lessons/fetchLessons',
  async (
    courseId: string,
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `/courses/${courseId}/lessons`,
      );

      return response.data.data as Lesson[];
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to fetch lessons',
      );
    }
  },
);

export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (
    {
      courseId,
      data,
    }: {
      courseId: string;
      data: LessonPayload;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/lessons`,
        data,
      );

      return response.data.data as Lesson;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to create lesson',
      );
    }
  },
);

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async (
    {
      courseId,
      lessonId,
      data,
    }: {
      courseId: string;
      lessonId: string;
      data: Partial<LessonPayload>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(
        `/courses/${courseId}/lessons/${lessonId}`,
        data,
      );

      return response.data.data as Lesson;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to update lesson',
      );
    }
  },
);

export const deleteLesson = createAsyncThunk(
  'lessons/deleteLesson',
  async (
    {
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await api.delete(
        `/courses/${courseId}/lessons/${lessonId}`,
      );

      return lessonId;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to delete lesson',
      );
    }
  },
);

export const reorderLessons = createAsyncThunk(
  'lessons/reorderLessons',
  async (
    {
      courseId,
      lessonIds,
    }: {
      courseId: string;
      lessonIds: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(
        `/courses/${courseId}/lessons/reorder`,
        {
          lessonIds,
        },
      );

      return response.data.data as Lesson[];
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to reorder lessons',
      );
    }
  },
);

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLessons.fulfilled,
        (state, action) => {
          state.loading = false;
          state.lessons = action.payload;
        },
      )
      .addCase(
        fetchLessons.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        },
      )
      .addCase(
        createLesson.fulfilled,
        (state, action) => {
          state.lessons.push(action.payload);
          state.lessons.sort(
            (first, second) =>
              first.order - second.order,
          );
        },
      )
      .addCase(
        updateLesson.fulfilled,
        (state, action) => {
          state.lessons = state.lessons.map(
            (lesson) =>
              lesson._id === action.payload._id
                ? action.payload
                : lesson,
          );
          state.lessons.sort(
            (first, second) =>
              first.order - second.order,
          );
        },
      )
      .addCase(
        deleteLesson.fulfilled,
        (state, action) => {
          state.lessons = state.lessons.filter(
            (lesson) =>
              lesson._id !== action.payload,
          );
        },
      )
      .addCase(
        reorderLessons.fulfilled,
        (state, action) => {
          state.lessons = action.payload;
        },
      );
  },
});

export default lessonSlice.reducer;

import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import api from '@/services/api';

type InstructorSummary = {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role?: string;
};

export type Course = {
    _id: string;
    title: string;
    description: string;
    price: number;
    status: string;
    thumbnail?: string | null;
    instructor?: InstructorSummary | string;
};

type CourseState = {
    courses: Course[];
    selectedCourse: Course | null;
    loading: boolean;
    detailLoading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    total: number;
};

type PaginatedCoursePayload = {
    data: Course[];
    pagination: {
        page: number;
        totalPages: number;
        total: number;
        limit: number;
    };
};

const initialState: CourseState = {
    courses: [],
    selectedCourse: null,
    loading: false,
    detailLoading: false,
    error: null,
    page: 1,
    totalPages: 1,
    total: 0,
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

export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (
        params: {
            page?: number;
            limit?: number;
            search?: string;
            status?: string;
            sort?: string;
        } = {},
        { rejectWithValue },
    ) => {
        try {
            const response = await api.get('/courses', {
                params,
            });

            return response.data.data as PaginatedCoursePayload;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to fetch courses',
            );
        }
    },
);

export const fetchInstructorCourses = createAsyncThunk(
    'courses/fetchInstructorCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(
                '/courses/instructor/me',
            );

            return response.data.data as Course[];
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to fetch instructor courses',
            );
        }
    },
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchCourseById',
    async (
        id: string,
        { rejectWithValue },
    ) => {
        try {
            const response = await api.get(
                `/courses/${id}`,
            );

            return response.data.data as Course;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to fetch course',
            );
        }
    },
);

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    async (
        data: Pick<
            Course,
            'title' | 'description' | 'price'
        >,
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post(
                '/courses',
                data,
            );

            return response.data.data as Course;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to create course',
            );
        }
    },
);

export const updateCourse = createAsyncThunk(
    'courses/updateCourse',
    async (
        {
            id,
            data,
        }: {
            id: string;
            data: Partial<
                Pick<
                    Course,
                    'title' | 'description' | 'price' | 'status'
                >
            >;
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.patch(
                `/courses/${id}`,
                data,
            );

            return response.data.data as Course;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to update course',
            );
        }
    },
);

export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/courses/${id}`);
            return id;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to delete course',
            );
        }
    },
);

export const publishCourse = createAsyncThunk(
    'courses/publishCourse',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/courses/${id}/publish`,
            );

            return (
                response.data.data?.course ||
                response.data.data
            ) as Course;
        } catch (error: unknown) {
            return rejectWithValue(
                getErrorMessage(error) ||
                    'Failed to publish course',
            );
        }
    },
);

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchCourses.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addCase(
                fetchCourses.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.courses = action.payload.data;
                    state.page =
                        action.payload.pagination.page;
                    state.totalPages =
                        action.payload.pagination.totalPages;
                    state.total =
                        action.payload.pagination.total;
                },
            )
            .addCase(
                fetchCourses.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                },
            )
            .addCase(
                fetchInstructorCourses.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addCase(
                fetchInstructorCourses.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.courses = action.payload;
                    state.page = 1;
                    state.total = action.payload.length;
                    state.totalPages = 1;
                },
            )
            .addCase(
                fetchInstructorCourses.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                },
            )
            .addCase(
                fetchCourseById.pending,
                (state) => {
                    state.detailLoading = true;
                    state.error = null;
                },
            )
            .addCase(
                fetchCourseById.fulfilled,
                (state, action) => {
                    state.detailLoading = false;
                    state.selectedCourse = action.payload;
                },
            )
            .addCase(
                fetchCourseById.rejected,
                (state, action) => {
                    state.detailLoading = false;
                    state.error =
                        action.payload as string;
                },
            )
            .addCase(
                createCourse.fulfilled,
                (state, action) => {
                    state.courses.unshift(action.payload);
                },
            )
            .addCase(
                updateCourse.fulfilled,
                (state, action) => {
                    state.courses = state.courses.map(
                        (course) =>
                            course._id ===
                            action.payload._id
                                ? action.payload
                                : course,
                    );

                    if (
                        state.selectedCourse?._id ===
                        action.payload._id
                    ) {
                        state.selectedCourse =
                            action.payload;
                    }
                },
            )
            .addCase(
                publishCourse.fulfilled,
                (state, action) => {
                    state.courses = state.courses.map(
                        (course) =>
                            course._id ===
                            action.payload._id
                                ? action.payload
                                : course,
                    );
                },
            )
            .addCase(
                deleteCourse.fulfilled,
                (state, action) => {
                    state.courses = state.courses.filter(
                        (course) =>
                            course._id !== action.payload,
                    );
                },
            );
    },
});

export default courseSlice.reducer;

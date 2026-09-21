import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import api from '@/services/api';

type DashboardStats = {
    totalCourses: number;
    totalStudents: number;
    totalInstructors: number;
    totalEnrollments: number;
};

type CourseStatus = {
    published: number;
    draft: number;
};

type RecentEnrollment = {
    _id: string;
    status?: string;
    progress?: number;
    student?: {
        name?: string;
        email?: string;
    };
    course?: {
        title?: string;
    };
};

type DashboardState = {
    stats: DashboardStats;
    courseStatus: CourseStatus;
    recentEnrollments: RecentEnrollment[];
    loading: boolean;
    error: string | null;
};

const initialState: DashboardState = {
    stats: {
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalEnrollments: 0,
    },
    courseStatus: {
        published: 0,
        draft: 0,
    },
    recentEnrollments: [],
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

export const fetchDashboardStats =
    createAsyncThunk(
        'dashboard/fetchDashboardStats',
        async (_, { rejectWithValue }) => {
            try {
                const response = await api.get(
                    '/dashboard/stats',
                );

                return response.data.data as {
                    stats?: DashboardStats;
                    courseStatus?: CourseStatus;
                    recentEnrollments?: RecentEnrollment[];
                };
            } catch (error: unknown) {
                return rejectWithValue(
                    getErrorMessage(error) ||
                    'Failed to fetch dashboard data',
                );
            }
        },
    );

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchDashboardStats.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addCase(
                fetchDashboardStats.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;
                    state.stats =
                        action.payload?.stats || {
                            totalCourses: 0,
                            totalStudents: 0,
                            totalInstructors: 0,
                            totalEnrollments: 0,
                        };
                    state.courseStatus =
                        action.payload?.courseStatus || {
                            published: 0,
                            draft: 0,
                        };
                    state.recentEnrollments =
                        action.payload
                            ?.recentEnrollments || [];
                },
            )
            .addCase(
                fetchDashboardStats.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        (action.payload as string) ||
                        'Failed to fetch dashboard data';
                },
            );
    },
});

export default dashboardSlice.reducer;

import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';

import api from '@/services/api';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthPayload = {
    user: User;
    accessToken: string;
    refreshToken: string;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    initialized: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',

    async (
        data: {
            email: string;
            password: string;
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post(
                '/auth/login',
                data,
            );

            return response.data.data as AuthPayload;
        } catch (error: unknown) {
            const message =
                error &&
                typeof error === 'object' &&
                'response' in error
                    ? (
                        error as {
                            response?: {
                                data?: {
                                    message?: string;
                                };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            return rejectWithValue(
                message || 'Login failed',
            );
        }
    },
);

const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
        },

        restoreAuth: (state) => {
            if (typeof window === 'undefined') {
                return;
            }

            const accessToken =
                localStorage.getItem('accessToken');

            const refreshToken =
                localStorage.getItem('refreshToken');

            const user =
                localStorage.getItem('user');

            if (accessToken && user) {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
            }
            state.initialized = true;
        },

    },

    extraReducers: (builder) => {
        builder

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                loginUser.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.user = action.payload.user;
                    state.accessToken = action.payload.accessToken;
                    state.refreshToken = action.payload.refreshToken;
                    state.isAuthenticated = true;

                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'accessToken',
                            action.payload.accessToken,
                        );

                        localStorage.setItem(
                            'refreshToken',
                            action.payload.refreshToken,
                        );

                        localStorage.setItem(
                            'user',
                            JSON.stringify(action.payload.user),
                        );
                    }

                    state.initialized = true;
                },
            )

            .addCase(
                loginUser.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload as string;
                },
            );
    },


});

export const {
    logout,
    restoreAuth
} = authSlice.actions;

export default authSlice.reducer;

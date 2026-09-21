import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import coursesReducer from './features/courses/courseSlice';
import enrollmentReducer from './features/enrollments/enrollmentSlice';
import lessonsReducer from './features/lessons/lessonSlice';
import notificationReducer from './features/notifications/notificationSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        enrollments: enrollmentReducer,
        lessons: lessonsReducer,
        notifications: notificationReducer,
        dashboard: dashboardReducer,
    },
});

export type RootState = ReturnType<
    typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;
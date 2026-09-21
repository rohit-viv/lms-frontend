'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';

import {
    clearNotifications,
    fetchNotifications,
    markNotificationRead,
} from '@/store/features/notifications/notificationSlice';

export default function NotificationsPage() {
    const dispatch = useAppDispatch();

    const {
        notifications,
        loading,
        error,
    } = useAppSelector(
        (state) => state.notifications,
    );

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-gray-50 p-6 md:p-10">

                <div className="mx-auto max-w-4xl">

                    <div className="mb-6 flex items-center justify-between">

                        <h1 className="text-3xl font-bold">
                            Notifications
                        </h1>

                        {notifications.length > 0 && (
                            <button
                                onClick={() =>
                                    dispatch(clearNotifications())
                                }
                                className="rounded bg-red-500 px-4 py-2 text-white"
                            >
                                Clear All
                            </button>
                        )}

                    </div>

                    {loading && (
                        <div className="rounded bg-white p-6 shadow">
                            <p className="text-gray-500">
                                Loading notifications...
                            </p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="rounded bg-red-50 p-6 text-red-600 shadow">
                            {error}
                        </div>
                    )}

                    {notifications.length === 0 && !loading && !error && (
                        <div className="rounded bg-white p-6 shadow">
                            <p className="text-gray-500">
                                No notifications yet.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">

                        {notifications.map(
                            (notification, index) => (
                                <div
                                    key={
                                        notification._id ||
                                        notification.id ||
                                        index
                                    }
                                    className={`rounded-lg p-5 shadow ${
                                        notification.isRead
                                            ? 'bg-white'
                                            : 'bg-blue-50'
                                    }`}
                                >

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="font-semibold">
                                        {notification.title}
                                            </h2>

                                            <p className="mt-2 text-gray-600">
                                        {notification.message}
                                            </p>
                                        </div>

                                        {!notification.isRead &&
                                            notification._id && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            markNotificationRead(
                                                                notification._id!,
                                                            ),
                                                        )
                                                    }
                                                    className="rounded border border-blue-200 bg-white px-3 py-2 text-sm text-blue-700"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                    </div>

                                    {notification.createdAt && (
                                        <p className="mt-3 text-xs text-gray-400">
                                            {new Date(
                                                notification.createdAt,
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                </div>
                            ),
                        )}

                    </div>

                </div>

            </main>
        </ProtectedRoute>
    );
}

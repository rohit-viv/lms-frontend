'use client';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {
    logout,
    restoreAuth,
} from './features/auth/authSlice';
import NotificationSocket from '@/components/NotificationSocket';
import { AUTH_LOGOUT_EVENT } from '@/services/api';


function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        store.dispatch(restoreAuth());

        const handleForcedLogout = () => {
            store.dispatch(logout());
        };

        window.addEventListener(
            AUTH_LOGOUT_EVENT,
            handleForcedLogout,
        );

        return () => {
            window.removeEventListener(
                AUTH_LOGOUT_EVENT,
                handleForcedLogout,
            );
        };
    }, []);

    return children;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <AuthInitializer>
                <NotificationSocket />
                {children}
            </AuthInitializer>
        </Provider>
    );
}

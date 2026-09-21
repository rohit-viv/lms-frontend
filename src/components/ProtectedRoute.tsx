'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const {
        isAuthenticated,
        initialized,
    } = useAppSelector(
        (state) => state.auth,
    );

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [
        initialized,
        isAuthenticated,
        router,
    ]);

    if (!initialized) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p>Loading...</p>;
    }

    return children;
}

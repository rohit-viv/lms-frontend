'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

type RoleGuardProps = {
    allowedRoles: string[];
    children: React.ReactNode;
};

export default function RoleGuard({
    allowedRoles,
    children,
}: RoleGuardProps) {
    const router = useRouter();

    const {
        user,
        initialized,
        isAuthenticated,
    } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!initialized) return;

        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (
            user &&
            !allowedRoles.includes(user.role)
        ) {
            router.replace('/dashboard');
        }
    }, [
        initialized,
        isAuthenticated,
        user,
        allowedRoles,
        router,
    ]);

    if (!initialized) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (
        !user ||
        !allowedRoles.includes(user.role)
    ) {
        return null;
    }

    return children;
}
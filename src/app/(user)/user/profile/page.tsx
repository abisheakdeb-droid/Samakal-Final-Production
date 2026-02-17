"use client";

import React from 'react';
import ProfileDashboard from '@/components/user/ProfileDashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
            <ProfileDashboard />
        </div>
    );
}

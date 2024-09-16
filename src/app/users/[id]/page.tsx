import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserDetailForm from '@/components/Users/UserDetailForm';
import ProtectedRoute from '@/components/ProtectedRoutes';

function UserDetail({ params }) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Users", href: "/users" },
        { label: `${params.id}` }
    ];

    return (
        <DefaultLayout>
            <ProtectedRoute roles={['Admin']}>
                <div className="mx-auto max-w-242.5">
                    <Breadcrumb breadcrumbs={breadcrumbs} />
                    <UserDetailForm id={params.id} />
                </div>
            </ProtectedRoute>
        </DefaultLayout>
    )
}

export default UserDetail
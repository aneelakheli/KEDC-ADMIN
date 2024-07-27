import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserDetailForm from '@/components/Users/UserDetailForm';

function UserDetail({ params }) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Users", href: "/users" },
        { label: `${params.id}` }
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <UserDetailForm id={params.id} />
            </div>
        </DefaultLayout>
    )
}

export default UserDetail
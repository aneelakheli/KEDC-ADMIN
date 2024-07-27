import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookDetail from '@/components/Books/BookDetail';

function UserDetail({params}) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Books", href: "/books" },
        { label: `Edit`}
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <BookDetail id={params.id}/>
            </div>
        </DefaultLayout>
    )
}

export default UserDetail
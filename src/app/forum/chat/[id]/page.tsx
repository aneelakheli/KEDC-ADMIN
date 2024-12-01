import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ForumDetail from '@/components/Forum/ForumDetail';

function UserDetail({params}:{params:{id:string}}) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Forum", href: "/forum" },
        { label: `Detail`}
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <ForumDetail id={params.id}/>
            </div>
        </DefaultLayout>
    )
}

export default UserDetail
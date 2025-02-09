import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InquiryDetail from '@/components/Inquiries/InquiryDetail';

function UserDetail({ params }: { params: { id: string } }) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Inquiries", href: "/inquiries" },
        { label: `Detail` }
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <InquiryDetail id={params.id} />
            </div>
        </DefaultLayout>
    )
}

export default UserDetail
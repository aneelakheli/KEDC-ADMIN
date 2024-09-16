import React from 'react'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookDetail from '@/components/Books/BookDetail';
import CatalogueDetail from '@/components/Catalogues/CatalogueDetail';

function Catalogue({params}) {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Catalogues", href: "/catalogues" },
        { label: `Detail`}
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                {/* <BookDetail id={params.id}/> */}
                <CatalogueDetail id={params.id}/>
            </div>
        </DefaultLayout>
    )
}

export default Catalogue
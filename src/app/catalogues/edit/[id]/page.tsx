import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CatalogueForm from "@/components/Catalogues/CatalogueForm";
import ProtectedRoute from "@/components/ProtectedRoutes";

const Edit = ({ params }) => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Catalogue", href: "/catalogues" },
        { label: "Edit Catalogue" },
    ];

    return (
        <DefaultLayout>
            <ProtectedRoute roles={['Admin']}>
                <div className="mx-auto max-w-242.5">
                    <Breadcrumb breadcrumbs={breadcrumbs} />
                    <CatalogueForm catalogueId={params.id} />
                </div>
            </ProtectedRoute>
        </DefaultLayout>
    );
};

export default Edit;

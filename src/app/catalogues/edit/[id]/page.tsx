import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CatalogueForm from "@/components/Catalogues/CatalogueForm";

const Edit = ({params}) => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Catalogue", href: "/catalogues" },
        { label: "Edit Catalogue" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <CatalogueForm catalogueId={params.id}/>
            </div>
        </DefaultLayout>
    );
};

export default Edit;

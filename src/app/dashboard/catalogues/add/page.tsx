import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";
import CatalogueForm from "@/components/Catalogues/CatalogueForm";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Catalogues", href: "/catalogues" },
        { label: "Add Catalogue" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <CatalogueForm/>
            </div>
        </DefaultLayout>
    );
};

export default Add;

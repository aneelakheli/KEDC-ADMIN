import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";
import AboutForm from "@/components/AboutUs/AboutForm";

const Edit = ({params}:{params:{id:string}}) => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "About", href: "/about" },
        { label: "Edit About" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <AboutForm aboutId={params.id}/>
            </div>
        </DefaultLayout>
    );
};

export default Edit;

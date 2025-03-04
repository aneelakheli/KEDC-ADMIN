import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AboutForm from "@/components/AboutUs/AboutForm";
import AmendmentForm from "@/components/feedback/AmendmentForm";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Amendments", href: "/amendments" },
        { label: "add", title: "Add Book Amendment" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                {/* <AboutForm/> */}
                <AmendmentForm />
            </div>
        </DefaultLayout>
    );
};

export default Add;

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ForumForm from "@/components/Forum/ForumForm";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Forum", href: "/forum" },
        { label: "Start Discussion" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <ForumForm/>
            </div>
        </DefaultLayout>
    );
};

export default Add;

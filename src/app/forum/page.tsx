import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";
import ForumList from "@/components/Forum/ForumList";

const Forum = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Forum" }
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <ForumList />
            </div>
        </DefaultLayout>
    );
};

export default Forum;

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";

const Edit = ({params}) => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Books", href: "/books" },
        { label: "Edit Book" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <BookForm bookId={params.id}/>
            </div>
        </DefaultLayout>
    );
};

export default Edit;

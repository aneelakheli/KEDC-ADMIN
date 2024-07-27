import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Slider" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                {/* <ImageSlider/> */}
            </div>
        </DefaultLayout>
    );
};

export default Add;

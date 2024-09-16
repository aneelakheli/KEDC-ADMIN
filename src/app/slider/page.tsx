import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";
import ImageSliderForm from "@/components/ImageSlider/ImageSliderForm";
import ProtectedRoute from "@/components/ProtectedRoutes";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Slider" },
    ];

    return (
        <DefaultLayout>
            <ProtectedRoute roles={['Admin']}>
                <div className="mx-auto max-w-242.5">
                    <Breadcrumb breadcrumbs={breadcrumbs} />
                    {/* <ImageSlider/> */}
                    <ImageSliderForm />
                </div>
            </ProtectedRoute>
        </DefaultLayout>
    );
};

export default Add;

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookForm from "@/components/Books/BookForm";
import ContactForm from "@/components/Contacts/ContactForm";

const Add = () => {
    const breadcrumbs = [
        { label: "Dashboard", href: "/" },
        { label: "Contacts", href: "/contacts" },
        { label: "Add Contact" },
    ];

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <ContactForm/>
            </div>
        </DefaultLayout>
    );
};

export default Add;

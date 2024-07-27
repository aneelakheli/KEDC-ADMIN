import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InquiryTable from "@/components/Inquiries/InquiryTable"
import ContactsTable from "@/components/Contacts/ContactsTable";

const Inquiries = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Contacts", href: "/contacts" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <ContactsTable/>
      </div>
    </DefaultLayout>
  );
};

export default Inquiries;

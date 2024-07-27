import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InquiryTable from "@/components/Inquiries/InquiryTable"

const Inquiries = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Inquiries", href: "/inquiries" }
  ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <InquiryTable />
      </div>
    </DefaultLayout>
  );
};

export default Inquiries;

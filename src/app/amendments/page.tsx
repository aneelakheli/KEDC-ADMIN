import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"; import DefaultLayout from "@/components/Layouts/DefaultLayout";
import InquiryTable from "@/components/Inquiries/InquiryTable"
import FeedbackTable from "@/components/feedback/AmendmentTable";
import AmendmentTable from "@/components/feedback/AmendmentTable";

const Amendments = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Amendments", href: "/amendments" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AmendmentTable/>
      </div>
    </DefaultLayout>
  );
};

export default Amendments;

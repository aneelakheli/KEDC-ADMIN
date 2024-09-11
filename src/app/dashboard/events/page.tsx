import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";
import CategoryTable from "@/components/categories/CategoryTable";
import EventsTable from "@/components/Events/EventsTable";

const Books = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Events" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <EventsTable/>
      </div>
    </DefaultLayout>
  );
};

export default Books;

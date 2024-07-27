import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";

const Books = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Books", href: "/books" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <BookTable/>
      </div>
    </DefaultLayout>
  );
};

export default Books;

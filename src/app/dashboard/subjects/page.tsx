import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";
import CategoryTable from "@/components/categories/CategoryTable";

const Books = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Subjects", href: "/subjects" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <CategoryTable/>
      </div>
    </DefaultLayout>
  );
};

export default Books;

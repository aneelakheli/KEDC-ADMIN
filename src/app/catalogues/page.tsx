import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookTable from "@/components/Books/BookTable";
import CatalogueTable from "@/components/Catalogues/CatalogueTable";

const Books = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Catalogues", href: "/catalogues" }
];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <CatalogueTable/>
      </div>
    </DefaultLayout>
  );
};

export default Books;
